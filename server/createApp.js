var compression = require('compression');
var favicon = require('serve-favicon');
var methodOverride = require('method-override');
var morgan = require('morgan');

var language = require('../lib/middleware/language');
var createComponentRouter = require('./createComponentRouter');

module.exports = function createApp (keystone, express) {

	if (!keystone.app) {
		if (!express) {
			express = require('express');
		}
		keystone.app = express();
	}

	var app = keystone.app;

	keystone.initDatabase();
	keystone.initExpressSession();

	require('./initTrustProxy')(keystone, app);
	require('./initViewEngine')(keystone, app);
	require('./initViewLocals')(keystone, app);
	require('./bindIPRestrictions')(keystone, app);

	// Compress response bodies
	if (keystone.get('compress')) {
		app.use(compression());
	}

	// Pre static config
	if (typeof keystone.get('pre:static') === 'function') {
		keystone.get('pre:static')(app);
	}
	app.use(function (req, res, next) {
		keystone.callHook('pre:static', req, res, next);
	});

	// Serve static assets

	if (keystone.get('favico')) {
		app.use(favicon(keystone.getPath('favico')));
	}

	// unless the headless option is set (which disables the Admin UI),
	// bind the Admin UI's Static Router for public resources
	if (!keystone.get('headless')) {
		app.use('/' + keystone.get('admin path'), require('../admin/server').createStaticRouter(keystone));
	}

	require('./bindLessMiddleware')(keystone, app);
	require('./bindSassMiddleware')(keystone, app);
	require('./bindStylusMiddleware')(keystone, app);
	require('./bindStaticMiddleware')(keystone, app);
	require('./bindSessionMiddleware')(keystone, app);

	// Log dynamic requests
	if (keystone.get('logger')) {
		app.use(morgan(keystone.get('logger'), keystone.get('logger options')));
	}

	// If the user wants to define their own middleware for logging,
	// they should be able to
	if (keystone.get('logging middleware')) {
		app.use(keystone.get('logging middleware'));
	}

	// We should also allow custom logging middleware to exist in the normal middleware flow
	app.use(function (req, res, next) {
		keystone.callHook('pre:logger', req, res, next);
	});

	// unless the headless option is set (which disables the Admin UI),
	// bind the Admin UI's Dynamic Router
	if (!keystone.get('headless')) {
		app.use('/' + keystone.get('admin path'), require('../admin/server').createDynamicRouter(keystone));
	}

	// Pre bodyparser middleware
	if (typeof keystone.get('pre:bodyparser') === 'function') {
		keystone.get('pre:bodyparser')(app);
	}
	app.use(function (req, res, next) {
		keystone.callHook('pre:bodyparser', req, res, next);
	});

	require('./bindBodyParser')(keystone, app);
	app.use(methodOverride());

	// Set language preferences
	var languageOptions = keystone.get('language options') || {};
	if (!languageOptions.disable) {
		app.use(language(keystone));
	}

	// Add 'X-Frame-Options' to response header for ClickJacking protection
	if (keystone.get('frame guard')) {
		app.use(require('../lib/security/frameGuard')(keystone));
	}

	// Pre route config
	if (typeof keystone.get('pre:routes') === 'function') {
		keystone.get('pre:routes')(app);
	}
	app.use(function (req, res, next) {
		keystone.callHook('pre:routes', req, res, next);
	});

	// Configure React routes
	if (keystone.get('react routes')) {
		app.use('/', createComponentRouter(keystone.get('react routes')));
	}

	// Configure application routes
	if (typeof keystone.get('routes') === 'function') {
		keystone.get('routes')(app);
	}


	require('./bindRedirectsHandler')(keystone, app);

	// Error config
	if (typeof keystone.get('pre:error') === 'function') {
		keystone.get('pre:error')(app);
	}
	app.use(function (req, res, next) {
		keystone.callHook('pre:error', req, res, next);
	});
	require('./bindErrorHandlers')(keystone, app);

	return app;

};
