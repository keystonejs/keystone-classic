module.exports = function bindLessMiddleware (keystone, app) {
	// the less option can be a single path, or array of paths
	// when set, we configure the less middleware
	var lessPaths = keystone.get('less');
	var lessOptions = keystone.get('less options') || {};

	if (typeof lessPaths === 'string') {
		lessPaths = [lessPaths];
	}

	if (Array.isArray(lessPaths)) {
		lessPaths.forEach(function (path) {
			app.use(require('less-middleware')(keystone.expandPath(path), lessOptions));
		});
	}
};
