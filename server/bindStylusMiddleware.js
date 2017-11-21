module.exports = function bindStylusMiddleware (keystone, app) {
	// the stylus option can be a single path, or array of paths
	// when set, we configure the stylus middleware
	var stylusPaths = keystone.get('stylus');
	var stylusOptions = keystone.get('stylus options') || {};
	var debug = require('debug')('keystone:core:bindStylusMiddleware');
	var _ = require('lodash');
	var safeRequire = require('../lib/safeRequire');

	if (typeof stylusPaths === 'string') {
		stylusPaths = [stylusPaths];
	}

	if (Array.isArray(stylusPaths)) {
		debug('adding stylus');
		var stylusMiddleware = safeRequire('stylus', 'stylus').middleware;

		stylusPaths.forEach(function (path) {
			app.use(stylusMiddleware(_.extend({
				src: keystone.expandPath(path),
				dest: keystone.expandPath(path),
				compress: keystone.get('env') === 'production',
			}, stylusOptions)));
		});
	}
};
