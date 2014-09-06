var _ = require('underscore'),
	utils = require('keystone-utils');

function mountRederer(keystone) {
	// Allow usage of custom view engines
	
	var app = keystone.app;
	
	if (keystone.get('custom engine')) {
		app.engine(keystone.get('view engine'), keystone.get('custom engine'));
	}
	
	// Set location of view templates and view engine
	
	app.set('views', keystone.getPath('views') || path.sep + 'views');
	app.set('view engine', keystone.get('view engine'));
	
	// Apply locals
	
	if (utils.isObject(keystone.get('locals'))) {
		_.extend(app.locals, keystone.get('locals'));
	}
	
	// Indent HTML everywhere, except production

	if (keystone.get('env') !== 'production') {
		app.locals.pretty = true;
	}
	
	// Default view caching logic

	app.set('view cache', keystone.get('env') === 'production' ? true : false);
	
	// Setup view caching from app settings

	if (keystone.get('view cache') !== undefined) {
		app.set('view cache', keystone.get('view cache'));
	}
}

module.exports = mountRederer;
