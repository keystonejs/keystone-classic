var path = require('path');

module.exports = function initViewEngine (keystone) {
	// Allow usage of custom view engines
	if (keystone.get('custom engine')) {
		keystone.app.engine(keystone.get('view engine'), keystone.get('custom engine'));
	}

	// Set location of view templates and view engine
	keystone.app.set('views', keystone.getPath('views') || path.sep + 'views');
	keystone.app.set('view engine', keystone.get('view engine'));

	var customView = keystone.get('view');
	if (customView) {
		keystone.app.set('view', customView);
	}
};
