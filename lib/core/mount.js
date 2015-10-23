/**
 * Configures a Keystone app in encapsulated mode, but does not start it.
 * Connects to the database and runs updates and then calls back.
 *
 * Events are fired during initialisation to allow customisation, including:
 *   - onMount
 *
 * If the events argument is a function, it is assumed to be the mounted event.
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
 */

var debug = require('debug')('keystone:core:mount');
var express = require('express');
var favicon = require('serve-favicon');
var morgan = require('morgan');
var methodOverride = require('method-override');
var multer = require('multer');
var bodyParser = require('body-parser');
var compression = require('compression');

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

	require('../../server/initTrustProxy')(this, app);
	require('../../server/initViewEngine')(this, app);
	require('../../server/initViewLocals')(this, app);

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

	app.use(function(req, res, next) {
		console.log('PRE ADMIN STATIC: ' + req.originalUrl);
		next();
	});

	// unless the headless option is set (which disables the Admin UI),
	// add the Admin UI's Static Router for public resources
	if (!this.get('headless')) {
		app.use('/keystone', require('../../admin/server/app/static'));
	}

	app.use(function(req, res, next) {
		console.log('POST ADMIN STATIC: ' + req.originalUrl);
		next();
	});

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
	app.use(keystone.get('session options').cookieParser);

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

	// Open database connection
	this.openDatabaseConnection(events);

}

module.exports = mount;
