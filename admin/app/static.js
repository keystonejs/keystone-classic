/**
 * Returns an Express Router with bindings for the Admin UI static resources,
 * i.e files, less and browserified scripts.
 *
 * Should be included before other middleware (e.g. session management,
 * logging, etc) for reduced overhead.
 */

var babelify = require('babelify');
var browserify = require('./browserify');
var express = require('express');
var packages = require('../packages');
var router = express.Router();

var bundles = {
	fields: browserify('fields.js', 'FieldTypes'),
	home: browserify('views/home.js'),
	item: browserify('views/item.js'),
	list: browserify('views/list.js')
};

router.prebuild = function() {
	bundles.fields.build();
	bundles.home.build();
	bundles.item.build();
	bundles.list.build();
};

router.use('/styles', require('less-middleware')(__dirname + '../../public/styles'));
router.use(express.static(__dirname + '../../public'));
router.get('/js/fields.js', bundles.fields.serve);
router.get('/js/home.js', bundles.home.serve);
router.get('/js/item.js', bundles.item.serve);
router.get('/js/list.js', bundles.list.serve);

module.exports = router;
