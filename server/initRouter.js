var compression = require('compression');
var favicon = require('serve-favicon');
var methodOverride = require('method-override');
var morgan = require('morgan');

var language = require('../lib/middleware/language');

module.exports = function initRouter (router, routesFunc) {

	var keystone = this;

	require('./bindIPRestrictions')(keystone, router);

	// Compress response bodies
	if (keystone.get('compress')) {
		router.use(compression());
	}

	// Pre static config
	if (typeof keystone.get('pre:static') === 'function') {
		keystone.get('pre:static')(router);
	}
	router.use(function (req, res, next) {
		keystone.callHook('pre:static', req, res, next);
	});

	// Serve static assets

	if (keystone.get('favicon')) {
		router.use(favicon(keystone.getPath('favicon')));
	}

	// unless the headless option is set (which disables the Admin UI),
	// bind the Admin UI's Static Router for public resources
	if (!keystone.get('headless')) {
		router.use('/' + keystone.get('admin path'), require('../admin/server').createStaticRouter(keystone));
	}

	require('./bindLessMiddleware')(keystone, router);
	require('./bindSassMiddleware')(keystone, router);
	require('./bindStylusMiddleware')(keystone, router);
	require('./bindStaticMiddleware')(keystone, router);
	require('./bindSessionMiddleware')(keystone, router);

	// Log dynamic requests
	router.use(function (req, res, next) {
		keystone.callHook('pre:logger', req, res, next);
	});

	// Bind default logger (morgan)
	if (keystone.get('logger')) {
		var loggerOptions = keystone.get('logger options');
		var hasOwnProperty = Object.prototype.hasOwnProperty;
		if (loggerOptions && typeof loggerOptions.tokens === 'object') {
			for (var key in loggerOptions.tokens) {
				if (hasOwnProperty.call(loggerOptions.tokens, key) && typeof loggerOptions.tokens[key] === 'function') {
					morgan.token(key, loggerOptions.tokens[key]);
				}
			}
		}

		router.use(morgan(keystone.get('logger'), loggerOptions));
	}
	// Bind custom logging middleware
	if (keystone.get('logging middleware')) {
		router.use(keystone.get('logging middleware'));
	}

	// unless the headless option is set (which disables the Admin UI),
	// bind the Admin UI's Dynamic Router
	if (!keystone.get('headless')) {
		router.use(function (req, res, next) {
			keystone.callHook('pre:admin', req, res, next);
		});
		router.use('/' + keystone.get('admin path'), require('../admin/server').createDynamicRouter(keystone));
	}

	// Pre bodyparser middleware
	if (typeof keystone.get('pre:bodyparser') === 'function') {
		keystone.get('pre:bodyparser')(router);
	}
	router.use(function (req, res, next) {
		keystone.callHook('pre:bodyparser', req, res, next);
	});

	require('./bindBodyParser')(keystone, router);
	router.use(methodOverride());

	// Set language preferences
	var languageOptions = keystone.get('language options') || {};
	if (!languageOptions.disable) {
		router.use(language(keystone));
	}

	// Add 'X-Frame-Options' to response header for ClickJacking protection
	if (keystone.get('frame guard')) {
		router.use(require('../lib/security/frameGuard')(keystone));
	}

	// Pre route config
	if (typeof keystone.get('pre:routes') === 'function') {
		keystone.get('pre:routes')(router);
	}
	router.use(function (req, res, next) {
		keystone.callHook('pre:routes', req, res, next);
	});

	// Configure supplied routes
	if (typeof routesFunc === 'function') {
		routesFunc(router);
	}

	require('./bindRedirectsHandler')(keystone, router);

	// Error config
	if (typeof keystone.get('pre:error') === 'function') {
		keystone.get('pre:error')(router);
	}
	router.use(function (req, res, next) {
		keystone.callHook('pre:error', req, res, next);
	});
	require('./bindErrorHandlers')(keystone, router);
};
