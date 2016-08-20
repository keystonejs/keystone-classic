/**
 * Returns an Express Router with bindings for the Admin UI static resources,
 * i.e files, less and browserified scripts.
 *
 * Should be included before other middleware (e.g. session management,
 * logging, etc) for reduced overhead.
 */

var express = require('express');
var less = require('less-middleware');
var path = require('path');

module.exports = function createStaticRouter (options) {
	var adminPath = options.adminPath || '/';
	var customStylesPath = options.customStylesPath || '';
	var router = express.Router();

	/* Prepare LESS options */
	var elementalPath = path.join(path.dirname(require.resolve('elemental')), '..');
	var reactSelectPath = path.join(path.dirname(require.resolve('react-select')), '..');

	var lessOptions = {
		render: {
			modifyVars: {
				elementalPath: JSON.stringify(elementalPath),
				reactSelectPath: JSON.stringify(reactSelectPath),
				customStylesPath: JSON.stringify(customStylesPath),
				adminPath: JSON.stringify(adminPath),
			},
		},
	};

	/* Configure router */
	router.use('/styles', less(path.resolve(__dirname + '/../../public/styles'), lessOptions));
	router.use('/styles/fonts', express.static(path.resolve(__dirname + '/../../public/js/lib/tinymce/skins/keystone/fonts')));
	router.use(express.static(path.resolve(__dirname + '/../../public')));

	return router;
};
