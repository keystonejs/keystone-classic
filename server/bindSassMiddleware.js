module.exports = function bindSassMiddleware (keystone, app) {
	// the sass option can be a single path, or array of paths
	// when set, we configure the node-sass middleware

	var sassPaths = keystone.get('sass');
	var sassOptions = keystone.get('sass options') || {};
	var debug = require('debug')('keystone:core:bindSassMiddleware');
	var _ = require('lodash');
	var safeRequire = require('../lib/safeRequire');

	if (typeof sassPaths === 'string') {
		sassPaths = [sassPaths];
	}

	if (Array.isArray(sassPaths)) {
		debug('adding sass');
		var sassMiddleware = safeRequire('node-sass-middleware', 'sass');

		var outputStyle = keystone.get('env') === 'production' ? 'compressed' : 'nested';
		sassPaths.forEach(function (path) {
			app.use(sassMiddleware(_.extend({
				src: keystone.expandPath(path),
				dest: keystone.expandPath(path),
				outputStyle: outputStyle,
			}, sassOptions)));
		});
	}
};
