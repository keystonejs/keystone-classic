var fs = require('fs');
var debug = require('debug')('keystone:core:importer');
var path = require('path');

/**
 * Returns a function that looks in a specified path relative to the current
 * directory, and returns all .js modules in it (recursively).
 *
 * ####Example:
 *
 *     var file = keystone.fileImporter(fileName);
 *
 * @param {String} rel__dirname
 * @api public
 */

function dispatchFileImporter (rel__dirname) {

	function importer (fileName) {
		debug('importing ', fileName);
		var imported = {};
		var joinPath = function () {
			return '.' + path.sep + path.join.apply(path, arguments);
		};

		var filePath = joinPath(path.relative(process.cwd(), rel__dirname), fileName);
		// only import files that we can `require`
		var ext = path.extname(filePath);
		var base = path.basename(filePath, ext);
		if (require.extensions[ext]) {
			imported[base] = require(path.join(rel__dirname, filePath));
		} else {
			debug('cannot require ', ext);
		}

		return imported;
	}

	return importer;
}

module.exports = dispatchFileImporter;
