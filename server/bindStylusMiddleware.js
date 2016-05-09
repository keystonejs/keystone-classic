module.exports = function bindStylusMiddleware (keystone, app) {
	// the stylus option can be a single path, or array of paths
	// when set, we configure the stylus middleware
	var stylusPaths = keystone.get('stylus');
	var stylusOptions = keystone.get('stylus options') || {};
	var debug = require('debug')('keystone:core:bindStylusMiddleware');
	var _ = require('lodash');

	if (typeof stylusPaths === 'string') {
		stylusPaths = [stylusPaths];
	}

	if (Array.isArray(stylusPaths)) {
		var stylusMiddleware;
		try {
			debug('adding stylus');
			stylusMiddleware = require('stylus').middleware;
		} catch (e) {
			if (e.code === 'MODULE_NOT_FOUND') {
				console.error(
					'\nERROR: stylus not found.\n'
					+ '\nPlease install stylus from npm to use the `stylus` option.'
					+ '\nYou can do this by running "npm install stylus --save".\n'
				);
				process.exit(1);
			} else {
				throw e;
			}
		}
		stylusPaths.forEach(function (path) {
			app.use(stylusMiddleware(_.extend({
				src: keystone.expandPath(path),
				dest: keystone.expandPath(path),
				compress: keystone.get('env') === 'production',
			}, stylusOptions)));
		});
	}
};
