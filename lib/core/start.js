/**
 * Configures and starts a Keystone app in encapsulated mode.
 *
 * Connects to the database, runs updates and listens for incoming requests.
 *
 * Events are fired during initialisation to allow customisation, including:
 *
 *   - onMount
 *   - onStart
 *   - onHttpServerCreated
 *   - onHttpsServerCreated
 *
 * If the events argument is a function, it is assumed to be the started event.
 *
 *
 * ####Options:
 *
 * Keystone supports the following options specifically for running in encapsulated mode:
 *
 *   - name
 *   - port
 *   - views
 *   - view engine
 *   - compress
 *   - favico
 *   - less
 *   - static
 *   - headless
 *   - logger
 *   - cookie secret
 *   - session
 *   - 404
 *   - 500
 *   - routes
 *   - locals
 *   - auto update
 *   - ssl
 *   - sslport
 *   - sslkey
 *   - sslcert
 *
 *
 * @api public
 */

var fs = require('fs');
var debug = require('debug')('keystone:core:start');
var https = require('https');

var dashes = '\n------------------------------------------------\n';

function start(events) {
	
	// Validate arguments
	
	if ('function' === typeof events) {
		events = { onStart: events };
	}
	
	if (!events) events = {};
	
	// Ensure Keystone has been initialised
	
	if (!this.app) {
		throw new Error('KeystoneJS Initialisaton Error:\n\napp must be initialised. Call keystone.init() or keystone.connect(new Express()) first.\n\n');
	}
	
	// Localise references to this for closures
	
	var keystone = this,
		app = this.app;

	// Prebuild the Admin Resources
	this.adminApp.staticRouter.prebuild();

	// Maintain passed in onMount binding but override to start http servers
	// (call user-defined onMount first if present)
	
	var onMount = events.onMount;
	
	events.onMount = function() {
		
		onMount && onMount();// eslint-disable-line no-unused-expressions
		
		var startupMessages = ['KeystoneJS Started:'],
			waitForServers = 3;
			
		// Log the startup messages and calls the onStart method
		
		var serverStarted = function() {
			waitForServers--;
			if (waitForServers) return;
			if (keystone.get('logger')) {
				console.log(dashes + startupMessages.join('\n') + dashes);
			}
			debug('server starting');
			events.onStart && events.onStart();// eslint-disable-line no-unused-expressions
		};
		
		// Create the http server and listens to the specified port with default port specified
		
		var host = keystone.get('host'),
			port = keystone.get('port'),
			ssl = keystone.get('ssl'),
			unixSocket = keystone.get('unix socket'),
			httpReadyMsg;
		
		if (ssl !== 'only' && !unixSocket) {
			httpReadyMsg = keystone.get('name') + ' is ready on ';
			
			if (host) {
				httpReadyMsg += 'http://' + host;
				if (port) {
					httpReadyMsg += ':' + port;
				} else {
					httpReadyMsg += ':3000';
				}
			} else if (port){
				httpReadyMsg += 'port ' + port;
			} else {
				httpReadyMsg += 'port 3000';
			}
			
			var httpStarted = function(msg) {
				return function() {
					startupMessages.push(msg);
					serverStarted();
				};
			};
			
			if (host) {
				keystone.httpServer = app.listen(port || 3000, host, httpStarted(httpReadyMsg));
			} else {
				keystone.httpServer = app.listen(port || 3000, httpStarted(httpReadyMsg));
			}
			events.onHttpServerCreated && events.onHttpServerCreated();// eslint-disable-line no-unused-expressions
		} else {
			waitForServers--;
		}
		
		if (ssl && !unixSocket) {
			
			debug('start the ssl server');
			var sslOpts = keystone.get('https server options') || {};
			
			if (keystone.get('ssl cert') && fs.existsSync(keystone.getPath('ssl cert'))) {
				sslOpts.cert = fs.readFileSync(keystone.getPath('ssl cert'));
			}
			if (keystone.get('ssl key') && fs.existsSync(keystone.getPath('ssl key'))) {
				sslOpts.key = fs.readFileSync(keystone.getPath('ssl key'));
			}
			if (keystone.get('ssl ca') && fs.existsSync(keystone.getPath('ssl ca'))) {
				sslOpts.ca = fs.readFileSync(keystone.getPath('ssl ca'));
			}
			
			if (!sslOpts.key || !sslOpts.cert) {
				
				if (ssl === 'only') {
					console.log(keystone.get('name') + ' failed to start: invalid ssl configuration');
					process.exit();
				} else {
					startupMessages.push('Warning: Invalid SSL Configuration');
					serverStarted();
				}
				
			} else {
				
				var httpsStarted = function(msg) {
					return function() {
						startupMessages.push(msg);
						serverStarted();
					};
				};
				
				keystone.httpsServer = https.createServer(sslOpts, app);
				events.onHttpsServerCreated && events.onHttpsServerCreated();// eslint-disable-line no-unused-expressions
				
				var sslHost = keystone.get('ssl host') || host,
					sslPort = keystone.get('ssl port') || 3001;
				
				var httpsReadyMsg = (ssl === 'only') ? keystone.get('name') + ' (SSL) is ready on ' : 'SSL Server is ready on ';
				
				if (sslHost) {
					keystone.httpsServer.listen(sslPort, sslHost, httpsStarted(httpsReadyMsg + 'https://' + sslHost + ':' + sslPort));
				} else {
					var httpsPortMsg = (keystone.get('ssl port')) ? 'port: ' + keystone.get('ssl port') : 'default port 3001';
					keystone.httpsServer.listen(sslPort, httpsStarted(httpsReadyMsg + httpsPortMsg));
				}
				
			}
			
		} else {
			waitForServers--;
		}
		
		if(unixSocket) {
			
			var unixSocketStarted = function(msg) {
				return function() {
					startupMessages.push(msg);
					serverStarted();
				};
			};
			
			httpReadyMsg = keystone.get('name') + ' is ready on ' + unixSocket;
			
			fs.unlink(unixSocket, function(err) {// eslint-disable-line no-unused-vars, handle-callback-err
				keystone.httpServer = app.listen(unixSocket, unixSocketStarted(httpReadyMsg));
				events.onSocketServerCreated && events.onSocketServerCreated();// eslint-disable-line no-unused-expressions
				fs.chmod(unixSocket, 0x777, function(){
					// set permissions
				});
			});
			
		} else {
			waitForServers--;
		}
		
		process.on('uncaughtException', function(e) {
			if (e.code === 'EADDRINUSE') {
				console.log(dashes +
					keystone.get('name') + ' failed to start: address already in use\n' +
					'Please check you are not already running a server on the specified port.\n');
				process.exit();
			}/* else if (e.code === 'ECONNRESET') {
				// Connection reset by peer, ignore it instead of exiting server with a throw.
				// Disabled for release 0.2.16 while further research is being done.
				console.log('Connection reset by peer');
				console.log(e);
			} */else {
				console.log(e.stack || e);
				process.exit(1);
			}
		});
		
	};
	
	debug('mount the express app');
	this.mount(events);
	
	return this;
	
}

module.exports = start;
