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
 * @api public
 */

var async = require('async');

var dashes = '\n------------------------------------------------\n';

function start (events) {

	if (typeof events === 'function') {
		events = { onStart: events };
	}
	if (!events) events = {};

	function fireEvent (name) {
		if (typeof events[name] === 'function') {
			events[name]();
		}
	}

	process.on('uncaughtException', function (e) {
		if (e.code === 'EADDRINUSE') {
			console.log(dashes
				+ keystone.get('name') + ' failed to start: address already in use\n'
				+ 'Please check you are not already running a server on the specified port.\n');
			process.exit();
		} else {
			console.log(e.stack || e);
			process.exit(1);
		}
	});

	this.initExpressApp();

	var keystone = this;
	var app = keystone.app;

	this.openDatabaseConnection(function () {

		fireEvent('onMount');

		var ssl = keystone.get('ssl');
		var unixSocket = keystone.get('unix socket');
		var startupMessages = [`KeystoneJS v${keystone.version} started:`];

		async.parallel([
			// HTTP Server
			function (done) {
				if (ssl === 'only' || unixSocket) return done();
				require('../../server/startHTTPServer')(keystone, app, function (err, msg) {
					fireEvent('onHttpServerCreated');
					startupMessages.push(msg);
					done(err);
				});
			},
			// HTTPS Server
			function (done) {
				if (!ssl || unixSocket) return done();
				require('../../server/startSecureServer')(keystone, app, function () {
					fireEvent('onHttpsServerCreated');
				}, function (err, msg) {
					startupMessages.push(msg);
					done(err);
				});
			},
			// Unix Socket
			function (done) {
				if (!unixSocket) return done();
				require('../../server/startSocketServer')(keystone, app, function (err, msg) {
					fireEvent('onSocketServerCreated');
					startupMessages.push(msg);
					done(err);
				});
			},
		], function serversStarted (err, messages) {
			if (keystone.get('logger')) {
				console.log(dashes + startupMessages.join('\n') + dashes);
			}
			fireEvent('onStart');
		});
	});

	return this;
}

module.exports = start;
