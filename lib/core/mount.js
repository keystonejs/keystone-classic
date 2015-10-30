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

	this.initDatabase();
	this.initExpressSession();

	if ('function' === typeof events) {
		events = { onMount: events };
	}

	if (!events) events = {};

	/* Keystone's encapsulated Express App Setup */

	require('../../server/initTrustProxy')(this, app);
	require('../../server/initViewEngine')(this, app);
	require('../../server/initViewLocals')(this, app);

	// Bind IP Restrictions before all other middleware
	require('../../server/bindIPRestrictions')(this, app);

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
	// bind the Admin UI's Static Router for public resources
	if (!this.get('headless')) {
		app.use('/keystone', require('../../admin/server').createStaticRouter(this));
	}

	require('../../server/bindLessMiddleware')(this, app);
	require('../../server/bindSassMiddleware')(this, app);
	require('../../server/bindStaticMiddleware')(this, app);
	require('../../server/bindSessionMiddleware')(this, app);

	// Log dynamic requests
	if (this.get('logger')) {
		debug('adding request logger');
		app.use(morgan(this.get('logger'), this.get('logger options')));
	}

	// unless the headless option is set (which disables the Admin UI),
	// bind the Admin UI's Dynamic Router
	if (!this.get('headless')) {
		app.use('/keystone', require('../../admin/server').createDynamicRouter(this));
	}

	// Pre bodyparser middleware
	if ('function' === typeof this.get('pre:bodyparser')) {
		debug('configuring pre:bodyparser middleware');
		this.get('pre:bodyparser')(app);
	}
	app.use(function(req, res, next) {
		keystone.callHook('pre:bodyparser', req, res, next);
	});

	require('../../server/bindBodyParser')(this, app);
	app.use(methodOverride());

	// Add 'X-Frame-Options' to response header for ClickJacking protection
	if (this.get('frame guard')) {
		debug('enabling frame guard');
		app.use(require('../security/frameGuard')(this));
	}

	// Pre route config
	if ('function' === typeof this.get('pre:routes')) {
		debug('configuring pre:routes middleware');
		this.get('pre:routes')(app);
	}
	app.use(function(req, res, next) {
		keystone.callHook('pre:routes', req, res, next);
	});

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
