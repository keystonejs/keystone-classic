var _ = require('underscore'),
	express = require('express');

function mountStatics(keystone) {
	// Serve static assets
	
	var app = keystone.app;
	
	if (keystone.get('compress')) {
		app.use(express.compress());
	}
	
	if (keystone.get('favico')) {
		app.use(express.favicon(keystone.getPath('favico')));
	}
	
	if (keystone.get('less')) {
		app.use(require('less-middleware')(keystone.getPath('less')));
	}
	
	if (keystone.get('sass')) {
		var sass;
		try {
			sass = require('node-sass');
		} catch(e) {
			if (e.code === 'MODULE_NOT_FOUND') {
				console.error(
					'\nERROR: node-sass not found.\n' +
					'\nPlease install the node-sass from npm to use the `sass` option.' +
					'\nYou can do this by running "npm install node-sass --save".\n'
				);
				process.exit(1);
			} else {
				throw e;
			}
		}
		app.use(sass.middleware({
			src: keystone.getPath('sass'),
			dest: keystone.getPath('sass'),
			outputStyle: keystone.get('env') === 'production' ? 'compressed' : 'nested'
		}));
	}
	
	// the static option can be a single path, or array of paths
	
	var staticPaths = keystone.get('static');
	
	if (_.isString(staticPaths)) {
		staticPaths = [staticPaths];
	}
	
	if (_.isArray(staticPaths)) {
		_.each(staticPaths, function(value) {
			app.use(express.static(keystone.expandPath(value)));
		}, this);
	}
	
	// unless the headless option is set (which disables the Admin UI),
	// bind the static handler for the Admin UI public resources
	if (!keystone.get('headless')) {
		keystone.static(app);
	}
}

module.exports = mountStatics;
