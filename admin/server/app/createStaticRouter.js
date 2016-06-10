/**
 * Returns an Express Router with bindings for the Admin UI static resources,
 * i.e files, less and browserified scripts.
 *
 * Should be included before other middleware (e.g. session management,
 * logging, etc) for reduced overhead.
 */

var browserify = require('../middleware/browserify');
var express = require('express');
var less = require('less-middleware');
var path = require('path');

module.exports = function createStaticRouter (keystone) {
	var router = express.Router();

	/* Prepare browserify bundles */
	var bundles = {
		fields: browserify('fields/index.js', 'FieldTypes'),
		signin: browserify('Signin/index.js'),
		index: browserify('index.js'),
	};

	// prebuild static resources on the next tick in keystone dev mode; this
	// improves first-request performance but delays server start
	if (process.env.KEYSTONE_DEV === 'true' || process.env.KEYSTONE_PREBUILD_ADMIN) {
		process.nextTick(function () {
			bundles.fields.build();
			bundles.signin.build();
			bundles.index.build();
		});
	}

	/* Prepare LESS options */
	var elementalPath = path.join(path.dirname(require.resolve('elemental')), '..');
	var reactSelectPath = path.join(path.dirname(require.resolve('react-select')), '..');
	var customStylesPath = keystone.getPath('adminui custom styles') || '';

	var lessOptions = {
		render: {
			modifyVars: {
				elementalPath: JSON.stringify(elementalPath),
				reactSelectPath: JSON.stringify(reactSelectPath),
				customStylesPath: JSON.stringify(customStylesPath),
				adminPath: JSON.stringify(keystone.get('admin path')),
			},
		},
	};

	/* Configure router */
	router.use('/styles', less(path.resolve(__dirname + '/../../public/styles'), lessOptions));
	router.use('/styles/fonts', express.static(path.resolve(__dirname + '/../../public/js/lib/tinymce/skins/keystone/fonts')));
	router.get('/js/fields.js', bundles.fields.serve);
	router.get('/js/signin.js', bundles.signin.serve);
	router.get('/js/index.js', bundles.index.serve);
	router.use(express.static(path.resolve(__dirname + '/../../public')));

	return router;
};
