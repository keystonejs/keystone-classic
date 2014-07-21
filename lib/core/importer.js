var fs = require('fs'),
	path = require('path');

/**
 * Returns a function that looks in a specified path relative to the current
 * directory, and returns all .js modules it (recursively).
 *
 * ####Example:
 *
 *     var importRoutes = keystone.importer(__dirname);
 *
 *     var routes = {
 *         site: importRoutes('./site'),
 *         api: importRoutes('./api')
 *     };
 *
 * @param {String} rel__dirname
 * @api public
 */

function dispatchImporter(rel__dirname) {
	
	function importer(from) {
		var imported = {};
		var joinPath = function() {
			return '.' + path.sep + path.join.apply(path, arguments);
		};
		var fsPath = joinPath(path.relative(process.cwd(), rel__dirname), from);
		fs.readdirSync(fsPath).forEach(function(name) {
			var info = fs.statSync(path.join(fsPath, name));
			// recur
			if (info.isDirectory()) {
				imported[name] = importer(joinPath(from, name));
			} else {
				// only import .js files
				var parts = name.split('.');
				var ext = parts.pop();
				if (ext === 'js' || ext === 'coffee') {
					imported[parts.join('-')] = require(path.join(rel__dirname, from, name));
				}
			}
			return imported;
		});
		return imported;
	};
	
	return importer;
	
};

module.exports = dispatchImporter;
