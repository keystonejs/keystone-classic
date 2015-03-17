/**
 * Configures a Keystone app in encapsulated mode, but does not start it.
 *
 * Connects to the database and runs updates and then calls back.
 *
 * This is the code-path to use if you'd like to mount the keystone app as a sub-app in another express application.
 *
 *   var app = express();
 *
 *   //...do your normal express setup stuff, add middleware and routes (but not static content or error handling middleware yet)
 *
 *   keystone.mount('/content', app, function() {
 *	 //put your app's static content and error handling middleware here and start your server
 *   });
 *
 * Events are fired during initialisation to allow customisation, including:
 *
 *   - onMount
 *
 * If the events argument is a function, it is assumed to be the mounted event.
 *
 *
 * ####Options:
 *
 * Keystone supports the following options specifically for running in encapsulated mode (with no embedded server):
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
 *
 *
 * @api public
 */

var _ = require('underscore'),
	debug = require('debug')('keystone:core:mount'),
	P = require('bluebird'),
	express = require('express'),
	path = require('path'),
	utils = require('keystone-utils'),
	favicon = require('serve-favicon'),
	morgan = require('morgan'),
	methodOverride = require('method-override'),
	session = require('express-session'),
	multer = require('multer'),
	bodyParser = require('body-parser'),
	cookieParser = require('cookie-parser'),
	prepost = require('../prepost'),
	compression = require('compression');

var dashes = '\n------------------------------------------------\n';

function mount(mountPath, parentApp, events) {
  debug('mounting');
	// Validate the express app instance
	
	if (!this.app) {
		console.error('\nKeystoneJS Initialisaton Error:\n\napp must be initialised. Call keystone.init() or keystone.connect(new Express()) first.\n');
		process.exit(1);
	}
	
	// Localise references to this for closures
	
	var keystone = this,
		app = this.app;
	
	// this.nativeApp indicates keystone has been mounted natively
	// (not as part of a custom middleware stack)
	//
	this.nativeApp = true;
	
	// Initialise the mongo connection url
	
	if (!this.get('mongo')) {
		var dbName = this.get('db name') || utils.slug(this.get('name'));
		var dbUrl = process.env.MONGO_URI || process.env.MONGO_URL || process.env.MONGODB_URL || process.env.MONGOLAB_URI || process.env.MONGOLAB_URL || (process.env.OPENSHIFT_MONGODB_DB_URL || 'mongodb://localhost/') + dbName;
		debug('setting DB URI to : ' + dbUrl);
		this.set('mongo', dbUrl);
	}
	
	// Initialise and validate session options
	
	if (!this.get('cookie secret')) {
		console.error('\nKeystoneJS Configuration Error:\n\nPlease provide a `cookie secret` value for session encryption.\n');
		process.exit(1);
	}
	
	var sessionOptions = this.get('session options');
	
	if (!_.isObject(sessionOptions)) {
		sessionOptions = {};
	}
	
	if (!sessionOptions.key) {
		sessionOptions.key = 'keystone.sid';
	}
	
	_.defaults(sessionOptions, {
		resave: false,
		secret: this.get('cookie secret'),
		saveUninitialized: false
	});
	
	sessionOptions.cookieParser = cookieParser(this.get('cookie secret'));

	var sessionStore = this.get('session store');
	
	var sessionStorePromise;

	if (sessionStore) {
		
		var sessionStoreOptions = this.get('session store options') || {};

		// Perform any session store specific configuration or exit on an unsupported session store
		
		if (sessionStore === 'mongo') {
			sessionStore = 'connect-mongo';
		} else if (sessionStore === 'redis') {
			sessionStore = 'connect-redis';
		}
		
		switch (sessionStore) {
			case 'connect-mongo':
				debug('using mongo for session store');
				_.defaults(sessionStoreOptions, {
					collection: 'app_sessions',
					url: this.get('mongo')
				});
				break;
			
			case 'connect-mongostore':
				debug('using connect-mongostore for session store');
				_.defaults(sessionStoreOptions, {
					collection: 'app_sessions'
				});
				if (!sessionStoreOptions.db) {
					console.error(
						'\nERROR: connect-mongostore requires `session store options` to be set.' +
						'\n' +
						'\nSee http://localhost:8080/docs/configuration#options-database for details.' +
					'\n');
					process.exit(1);
				}
				break;
			
			case 'connect-redis':
				debug('using redis for session store');
				break;

			default:
				console.error(
					'\nERROR: unsupported session store ' + sessionStore + '.' +
					'\n' +
					'\nSee http://localhost:8080/docs/configuration#options-database for details.' +
				'\n');
				process.exit(1);
				break;
		}

		// Initialize the session store
		try {
			var SessionStore = require(sessionStore)(session);
			sessionStorePromise = new P(function(resolve) {
				sessionOptions.store = new SessionStore(sessionStoreOptions, resolve);
				sessionOptions.store.on('connect', resolve);
				sessionOptions.store.on('connected', resolve);
				sessionOptions.store.on('disconnect', function() {
					console.error(
						'\nThere was an error connecting to the ' + sessionStore + ' session store.' +
					'\n');
					process.exit(1);
				});
			});
		} catch(e) {
			if (e.code === 'MODULE_NOT_FOUND') {
				console.error(
					'\n' + e.toString() +
					'\nPlease install it from npm to use ' + this.get('session store') + ' as a `session store` option.' +
				'\n');
				process.exit(1);
			} else {
				throw e;
			}
		}
	}

	// expose initialised session and options
	
	this.set('session options', sessionOptions);
	this.set('express session', session(sessionOptions)); 
	
	
	// wrangle arguments
	
	if (arguments.length === 1) {
		events = arguments[0];
		mountPath = null;
	}
	
	if ('function' === typeof events) {
		events = { onMount: events };
	}
	
	if (!events) events = {};
	
	/* Express sub-app mounting to external app at a mount point (if specified) */
	
	if (mountPath) {
		//fix root-relative keystone urls for assets (gets around having to re-write all the keystone templates)
		parentApp.all(/^\/keystone($|\/.*)/, function(req, res, next) {
			req.url = mountPath + req.url;
			next();
		});
		
		parentApp.use(mountPath, app);
	}
	
	/* Keystone's encapsulated Express App Setup */
	
	// Allow usage of custom view engines
	
	if (this.get('custom engine')) {
		app.engine(this.get('view engine'), this.get('custom engine'));
	}
	
	// Set location of view templates and view engine
	
	app.set('views', this.getPath('views') || path.sep + 'views');
	app.set('view engine', this.get('view engine'));
	
	// Apply locals
	
	if (utils.isObject(this.get('locals'))) {
		_.extend(app.locals, this.get('locals'));
	}
	
	// Indent HTML everywhere, except production

	if (this.get('env') !== 'production') {
		app.locals.pretty = true;
	}
	
	// Default view caching logic

	app.set('view cache', this.get('env') === 'production' ? true : false);
	
	// Setup view caching from app settings

	if (this.get('view cache') !== undefined) {
		app.set('view cache', this.get('view cache'));
	}

	// Serve static assets

	if (this.get('compress')) {
		app.use(compression());
	}
	
	if (this.get('favico')) {
		app.use(favicon(this.getPath('favico')));
	}
	
	// the less option can be a single path, or array of paths
	// when set, we configure the less middleware
	
	var lessPaths = this.get('less'),
		lessMiddlewareOptions = this.get('less middleware options') || {},
		lessParserOptions = this.get('less parser options') || {},
		lessCompilerOptions = this.get('less compiler options') || {};
	
	if (_.isString(lessPaths)) {
		lessPaths = [lessPaths];
	}
	
	if (_.isArray(lessPaths)) {
		_.each(lessPaths, function(value) {
			app.use(require('less-middleware')(this.expandPath(value), lessMiddlewareOptions, lessParserOptions, lessCompilerOptions));
		}, this);
	}
	
	// the sass option can be a single path, or array of paths
	// when set, we configure the node-sass middleware
	
	var sassPaths = this.get('sass'),
		sassOptions = this.get('sass options') || {};
	
	if (_.isString(sassPaths)) {
		sassPaths = [sassPaths];
	}
	
	if (_.isArray(sassPaths)) {
		var sassMiddleware;
		try {
			debug('adding sass');
			sassMiddleware = require('node-sass-middleware');
		} catch(e) {
			if (e.code === 'MODULE_NOT_FOUND') {
				console.error(
					'\nERROR: node-sass not found.\n' +
					'\nPlease install the node-sass-middleware from npm to use the `sass` option.' +
					'\nYou can do this by running "npm install node-sass-middleware --save".\n'
				);
				process.exit(1);
			} else {
				throw e;
			}
		}
		_.each(sassPaths, function(value) {
			app.use(sassMiddleware(_.extend({
				src: this.expandPath(value),
				dest: this.expandPath(value),
				outputStyle: this.get('env') === 'production' ? 'compressed' : 'nested'
			}, sassOptions)));
		}, this);
	}
	
	// the static option can be a single path, or array of paths
	// when set, we configure the express static middleware
	
	var staticPaths = this.get('static');
	var staticOptions = this.get('static options');
	
	if (_.isString(staticPaths)) {
		staticPaths = [staticPaths];
	}
	
	if (_.isArray(staticPaths)) {
		_.each(staticPaths, function(value) {
			app.use(express.static(this.expandPath(value), staticOptions));
		}, this);
	}
	
	// unless the headless option is set (which disables the Admin UI),
	// bind the static handler for the Admin UI public resources
	if (!this.get('headless')) {
		debug('adding keystone static routes');
		this.static(app);
	}
	
	// Handle dynamic requests
	
	if (this.get('logger')) {
		debug('adding request logger');
		app.use(morgan(this.get('logger')));
	}
	
	if (this.get('file limit')) {
		debug('adding file limit');
		app.use(express.limit(this.get('file limit')));
	}

	debug('adding standard middlewares');
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({ extended: true }));
	app.use(methodOverride());
	app.use(sessionOptions.cookieParser);
	app.use(this.get('express session'));
	app.use(multer({
		includeEmptyFields: true
	}));
	app.use(require('connect-flash')());
	
	if (this.get('session') === true) {
		app.use(this.session.persist);
	} else if ('function' === typeof this.get('session')) {
		app.use(this.get('session'));
	}
	
	// Add 'X-Frame-Options' to response header for ClickJacking protection

	if(this.get('frame guard')) {
		debug('enabling frame guard');
		app.use(require('../security/frameGuard')(this));
	}

	// Process 'X-Forwarded-For' request header
	
	if (this.get('trust proxy') === true) {
		debug('enabling trusted proxy');
		app.enable('trust proxy');
	} else {
		app.disable('trust proxy');
	}
	
	// Check for IP range restrictions
	
	if (this.get('allowed ip ranges')) {
		if (!app.get('trust proxy')) {
			console.log(
				'KeystoneJS Initialisaton Error:\n\n' +
				'to set IP range restrictions the "trust proxy" setting must be enabled.\n\n'
			);
			process.exit(1);
		}
		debug('adding IP ranges', this.get('allowed ip ranges'));
		var ipRangeMiddleware = require('../security/ipRangeRestrict')(
			this.get('allowed ip ranges'),
			this.wrapHTMLError
		);
		this.pre('routes', ipRangeMiddleware);
	}
	
	// Pre-route middleware
	
	this.hooks('pre:routes', function(fn, next) {
		try {
			debug('adding pre-route middlewares');
			app.use(fn);
		}
		catch(e) {
			if (keystone.get('logger')) {
				console.log('Invalid pre-route middleware provided');
			}
			throw e;
		}
		next();
	});
	
	// Headless mode means don't bind the Keystone routes
	
	if (!this.get('headless')) {
		debug('adding keystone routes to express app');
		this.routes(app);
	}
	
	
	// Configure application routes
	if ('function' === typeof this.get('routes')) {
		debug('configuring app routes');
		this.get('routes')(app);
	}
	
	//prepare the error handlers; they should be called last
	var setHandlers = function () {
		// Handle redirects before 404s
	
		if (Object.keys(keystone._redirects).length) {
			app.use(function(req, res, next) {
				if (keystone._redirects[req.path]) {
					res.redirect(keystone._redirects[req.path]);
				} else {
					next();
				}
			});
		}
		
		// Handle 404 (no route matched) errors
		
		var default404Handler = function(req, res, next) {
			res.status(404).send(keystone.wrapHTMLError('Sorry, no page could be found at this address (404)'));
		};
		
		app.use(function(req, res, next) {
			
			var err404 = keystone.get('404');
			
			if (err404) {
				try {
					if ('function' === typeof err404) {
						err404(req, res, next);
					} else if ('string' === typeof err404) {
						res.status(404).render(err404);
					} else {
						if (keystone.get('logger')) {
							console.log(dashes + 'Error handling 404 (not found): Invalid type (' + (typeof err404) + ') for 404 setting.' + dashes);
						}
						default404Handler(req, res, next);
					}
				} catch(e) {
					if (keystone.get('logger')) {
						console.log(dashes + 'Error handling 404 (not found):');
						console.log(e);
						console.log(dashes);
					}
					default404Handler(req, res, next);
				}
			} else {
				default404Handler(req, res, next);
			}
			
		});
		
		// Handle other errors
		
		var default500Handler = function(err, req, res, next) {
			
			if (keystone.get('logger')) {
				if (err instanceof Error) {
					console.log((err.type ? err.type + ' ' : '') + 'Error thrown for request: ' + req.url);
				} else {
					console.log('Error thrown for request: ' + req.url);
				}
				console.log(err.stack || err);
			}
			
			var msg = '';
			
			if (keystone.get('env') === 'development') {
				
				if (err instanceof Error) {
					if (err.type) {
						msg += '<h2>' + err.type + '</h2>';
					}
					msg += utils.textToHTML(err.message);
				} else if ('object' === typeof err) {
					msg += '<code>' + JSON.stringify(err) + '</code>';
				} else if (err) {
					msg += err;
				}
			}
			
			res.status(500).send(keystone.wrapHTMLError('Sorry, an error occurred loading the page (500)', msg));
		};
		
		app.use(function(err, req, res, next) {
			
			var err500 = keystone.get('500');
			
			if (err500) {
				try {
					if ('function' === typeof err500) {
						err500(err, req, res, next);
					} else if ('string' === typeof err500) {
						res.locals.err = err;
						res.status(500).render(err500);
					} else {
						if (keystone.get('logger')) {
							console.log(dashes + 'Error handling 500 (error): Invalid type (' + (typeof err500) + ') for 500 setting.' + dashes);
						}
						default500Handler(err, req, res, next);
					}
				} catch(e) {
					if (keystone.get('logger')) {
						console.log(dashes + 'Error handling 500 (error):');
						console.log(e);
						console.log(dashes);
					}
					default500Handler(err, req, res, next);
				}
			} else {
				default500Handler(err, req, res, next);
			}
			
		});
	};
	
	// Connect to database
	
	var mongoConnectionOpen = false;
	
	// support replica sets for mongoose
	if (this.get('mongo replica set')){
		debug('setting up mongo replica set');
		var replicaData = this.get('mongo replica set');
		var replica = '';
		
		var credentials = (replicaData.username && replicaData.password) ? replicaData.username + ':' + replicaData.password + '@' : '';
		
		replicaData.db.servers.forEach(function (server) {
			replica += 'mongodb://' + credentials + server.host + ':' + server.port + '/' + replicaData.db.name + ',';
		});
		
		var options = {
			auth: { authSource: replicaData.authSource },
			replset: {
				rs_name: replicaData.db.replicaSetOptions.rs_name,
				readPreference: replicaData.db.replicaSetOptions.readPreference
			}
		};

		debug('connecting to replicate set');
		this.mongoose.connect(replica, options);
		
	} else {
		debug('connecting to mongo');
		this.mongoose.connect(this.get('mongo'));
		
	}
	
	this.mongoose.connection.on('error', function(err) {
		
		if (keystone.get('logger')) {
			console.log('------------------------------------------------');
			console.log('Mongo Error:\n');
			console.log(err);
		}
		
		if (mongoConnectionOpen) {
			if (err.name === 'ValidationError') return;
			throw err;
		} else {
			throw new Error('KeystoneJS (' + keystone.get('name') + ') failed to start');
		}
		
	}).on('open', function() {

		debug('mongo connection open');
		mongoConnectionOpen = true;
		
		var mounted = function() {
			events.onMount && events.onMount();
			setHandlers();
		};
		
		var connected = function() {
			if (keystone.get('auto update')) {
				debug('applying auto update');
				keystone.applyUpdates(mounted);
			} else {
				mounted();
			}
		};
		
		if (sessionStorePromise) {
			sessionStorePromise.then(connected);
		} else {
			connected();
		}
		
	});
}

module.exports = mount;
