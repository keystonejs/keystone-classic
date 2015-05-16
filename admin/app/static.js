/**
 * Returns an Express Router with bindings for the Admin UI static resources,
 * i.e files, less and browserified scripts.
 *
 * Should be included before other middleware (e.g. session management,
 * logging, etc) for reduced overhead.
 */

var browserify = require('./browserify');
var express = require('express');
var less = require('less-middleware');
var path = require('path');
var router = express.Router();

/* Prepare browserify bundles */

var bundles = {
	fields: browserify('fields.js', 'FieldTypes'),
	home: browserify('views/home.js'),
	item: browserify('views/item.js'),
	listHeader: browserify('views/list-header.js'),
	listTable: browserify('views/list-table.js')
};

router.prebuild = function() {
	bundles.fields.build();
	bundles.home.build();
	bundles.item.build();
	bundles.listHeader.build();
	bundles.listTable.build();
};

/* Prepare LESS options */

var reactSelectPath = path.join(path.dirname(require.resolve('react-select')), '..');

var lessOptions = {
	render: {
		modifyVars: {
			reactSelectPath: JSON.stringify(reactSelectPath)
		}
	}
};

/* Configure router */

router.use('/styles', less(__dirname + '../../public/styles', lessOptions));
router.use(express.static(__dirname + '../../public'));
router.get('/js/fields.js', bundles.fields.serve);
router.get('/js/home.js', bundles.home.serve);
router.get('/js/item.js', bundles.item.serve);
router.get('/js/list-header.js', bundles.listHeader.serve);
router.get('/js/list-table.js', bundles.listTable.serve);

module.exports = router;
