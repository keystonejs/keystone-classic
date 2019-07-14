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
var str = require('string-to-stream');

function buildFieldTypesStream (fieldTypes) {
	var src = '';
	var types = Object.keys(fieldTypes);
	['Column', 'Field', 'Filter'].forEach(function (i) {
		src += 'exports.' + i + 's = {\n';
		types.forEach(function (type) {
			if (typeof fieldTypes[type] !== 'string') return;
			src += type + ': require("../../fields/types/' + type + '/' + fieldTypes[type] + i + '"),\n';
		});
		// Append ID and Unrecognised column types
		if (i === 'Column') {
			src += 'id: require("../../fields/components/columns/IdColumn"),\n';
			src += '__unrecognised__: require("../../fields/components/columns/InvalidColumn"),\n';
		}

		src += '};\n';
	});
	return str(src);
}

module.exports = function createStaticRouter (keystone) {
	var keystoneHash = keystone.createKeystoneHash();
	var writeToDisk = keystone.get('cache admin bundles');
	var router = express.Router();

	/* Prepare browserify bundles */
	var bundles = {
		fields: browserify({
			stream: buildFieldTypesStream(keystone.fieldTypes),
			expose: 'FieldTypes',
			file: './FieldTypes.js',
			hash: keystoneHash,
			writeToDisk: writeToDisk,
		}),
		signin: browserify({
			file: './Signin/index.js',
			hash: keystoneHash,
			writeToDisk: writeToDisk,
		}),
		admin: browserify({
			file: './App/index.js',
			hash: keystoneHash,
			writeToDisk: writeToDisk,
		}),
	};

	// prebuild static resources on the next tick in keystone dev mode; this
	// improves first-request performance but delays server start
	if (process.env.KEYSTONE_DEV === 'true' || process.env.KEYSTONE_PREBUILD_ADMIN === 'true') {
		bundles.fields.build();
		bundles.signin.build();
		bundles.admin.build();
	}

	/* Prepare LESS options */
	var elementalPath = path.join(path.dirname(require.resolve('elemental')), '..');
	var reactSelectPath = path.join(path.dirname(require.resolve('react-select')), '..');
	var keystoneTinymcePath = path.dirname(require.resolve('keystone-tinymce'));
	var customStylesPath = keystone.getPath('adminui custom styles') || '';

	var lessOptions = {
		render: {
			javascriptEnabled: true,
			modifyVars: {
				elementalPath: JSON.stringify(elementalPath),
				reactSelectPath: JSON.stringify(reactSelectPath),
				keystoneTinymcePath: JSON.stringify(keystoneTinymcePath),
				customStylesPath: JSON.stringify(customStylesPath),
				adminPath: JSON.stringify(keystone.get('admin path')),
			},
		},
	};

	/* Configure router */
	router.use('/styles', less(path.resolve(__dirname + '/../../public/styles'), lessOptions));
	router.use('/styles/fonts', express.static(`${keystoneTinymcePath}/skin/fonts`));
	router.get('/js/fields.js', bundles.fields.serve);
	router.get('/js/signin.js', bundles.signin.serve);
	router.get('/js/admin.js', bundles.admin.serve);
	router.use('/js/lib/tinymce/skins/keystone', express.static(`${keystoneTinymcePath}/skin`));
	router.use('/js/lib/tinymce/plugins/uploadimage', express.static(`${keystoneTinymcePath}/plugins/uploadimage`));
	router.use('/js/lib/tinymce', express.static(path.dirname(require.resolve('tinymce'))));
	router.use(express.static(path.resolve(__dirname + '/../../public')));

	return router;
};
