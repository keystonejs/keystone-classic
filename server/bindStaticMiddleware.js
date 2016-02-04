var express = require('express');

module.exports = function bindStaticMiddleware (keystone, app) {
	// the static option can be a single path, or array of paths
	// when set, we configure the express static middleware

	var staticPaths = keystone.get('static');
	var staticOptions = keystone.get('static options');

	if (typeof staticPaths === 'string') {
		staticPaths = [staticPaths];
	}

	if (Array.isArray(staticPaths)) {
		staticPaths.forEach(function (value) {
			app.use(express.static(keystone.expandPath(value), staticOptions));
		});
	}
};
