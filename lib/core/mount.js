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

var _ = require('underscore');
var debug = require('debug')('keystone:core:mount');
var express = require('express');
var path = require('path');
var utils = require('keystone-utils');
var favicon = require('serve-favicon');
var morgan = require('morgan');
var methodOverride = require('method-override');
var multer = require('multer');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var compression = require('compression');

var dashes = '\n------------------------------------------------\n';

function mount(events) {
	debug('mounting');
	// Validate the express app instance

	if (!this.app) {
		console.error('\nKeystoneJS Initialisaton Error:\n\napp must be initialised. Call keystone.init() or keystone.connect(new Express()) first.\n');
		process.exit(1);
	}

	// Localise references to this for closures

	var keystone = this;
	var app = this.app;

	// this.nativeApp indicates keystone has been mounted natively
	// (not as part of a custom middleware stack)
	this.nativeApp = true;

	this.initMongo();
	this.initExpressSession();

	if ('function' === typeof events) {
		events = { onMount: events };
	}

	if (!events) events = {};

	/* Keystone's encapsulated Express App Setup */

	require('../../server/initTrustProxy')(keystone, app);
	require('../../server/initViewEngine')(keystone, app);
	require('../../server/initViewLocals')(keystone, app);

	// Compress response bodies
	if (this.get('compress')) {
		app.use(compression());
	}

	// Pre static config
	if ('function' === typeof this.get('pre:static')) {
		debug('configuring pre:static middleware');
		this.get('pre:static')(app);
	}
	app.use(function(req, res, next) {
		keystone.callHook('pre:static', req, res, next);
	});

	// Serve static assets

	if (this.get('favico')) {
		app.use(favicon(this.getPath('favico')));
	}

	// unless the headless option is set (which disables the Admin UI),
	// add the Admin UI's Static Router for public resources
	if (!this.get('headless')) {
		app.use('/keystone', require('../../admin/app/static'));
	}

	require('../../server/bindLessMiddleware')(this, app);
	require('../../server/bindSassMiddleware')(this, app);
	require('../../server/bindStaticMiddleware')(this, app);

	// Log dynamic requests
	if (this.get('logger')) {
		debug('adding request logger');
		app.use(morgan(this.get('logger'), this.get('logger options')));
	}

	// Pre bodyparser middleware
	if ('function' === typeof this.get('pre:bodyparser')) {
		debug('configuring pre:bodyparser middleware');
		this.get('pre:bodyparser')(app);
	}
	app.use(function(req, res, next) {
		keystone.callHook('pre:bodyparser', req, res, next);
	});

	// Set up body options and cookie parser
	var bodyParserParams = {};

	if (this.get('file limit')) {
		debug('adding file limit');
		bodyParserParams.limit = this.get('file limit');
	}

	app.use(bodyParser.json(bodyParserParams));
	bodyParserParams.extended = true;
	app.use(bodyParser.urlencoded(bodyParserParams));
	app.use(methodOverride());
	app.use(sessionOptions.cookieParser);

	// Pre session config
	if ('function' === typeof this.get('pre:session')) {
		debug('configuring pre:session middleware');
		this.get('pre:session')(app);
	}
	app.use(function(req, res, next) {
		keystone.callHook('pre:session', req, res, next);
	});

	app.use(this.expressSession);
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
	if (this.get('frame guard')) {
		debug('enabling frame guard');
		app.use(require('../security/frameGuard')(this));
	}

	require('../../server/bindIPRestrictions')(this, app);

	// Pre route config

	// Pre session config
	if ('function' === typeof this.get('pre:routes')) {
		debug('configuring pre:routes middleware');
		this.get('pre:routes')(app);
	}
	app.use(function(req, res, next) {
		keystone.callHook('pre:routes', req, res, next);
	});

	// unless the headless option is set (which disables the Admin UI),
	// include the Admin UI route handlers
	if (!this.get('headless')) {
		debug('adding keystone routes to express app');
		this.routes(app);
	}


	// Configure application routes
	if ('function' === typeof this.get('routes')) {
		debug('configuring app routes');
		this.get('routes')(app);
	}

	require('../../server/bindRedirectsHandler')(this, app);
	require('../../server/bindErrorHandlers')(this, app);

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
			throw new Error('KeystoneJS (' + keystone.get('name') + ') failed to start - Check that you are running `mongod` in a separate process.');
		}

	}).on('open', function() {

		debug('mongo connection open');
		mongoConnectionOpen = true;

		var mounted = function() {
			events.onMount && events.onMount();// eslint-disable-line no-unused-expressions
		};

		var connected = function() {
			if (keystone.get('auto update')) {
				debug('applying auto update');
				keystone.applyUpdates(mounted);
			} else {
				mounted();
			}
		};

		if (this.sessionStorePromise) {
			this.sessionStorePromise.then(connected);
		} else {
			connected();
		}

	});
}

module.exports = mount;
