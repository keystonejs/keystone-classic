/**
 * Returns an Express Router with bindings for the Admin UI static resources,
 * i.e files, less and browserified scripts.
 * 
 * Should be included before other middleware (e.g. session management,
 * logging, etc) for reduced overhead.
 */

var babelify = require('babelify');
var browserify = require('browserify-middleware');
var debug = require('debug')('keystone:admin:app:static');
var express = require('express');
var packages = require('../packages');
var router = express.Router();

router.use('/styles', require('less-middleware')(__dirname + '../../../public/styles'));
router.use(express.static(__dirname + '../../../public'));
router.use('/js', browserify(__dirname + '../../../admin/src/views', {
	external: packages,
	transform: [babelify]
}));

module.exports = router;
