var path = require('path');

module.exports = function initViewEngine (keystone, app) {
	// Allow usage of custom view engines
	if (keystone.get('custom engine')) {
		app.engine(keystone.get('view engine'), keystone.get('custom engine'));
	}

	// Set location of view templates and view engine
	app.set('views', keystone.getPath('views') || path.sep + 'views');
	app.set('view engine', keystone.get('view engine'));

	var customView = keystone.get('view');
	if (customView) {
		app.set('view', customView);
	}
};
