var fs = require('fs');
var debug = require('debug')('keystone:core:importer');
var path = require('path');
var minimatch = require('minimatch');
/**
 * Returns a function that looks in a specified path relative to the current
 * directory, and returns all .js modules in it (recursively).
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

function dispatchImporter (rel__dirname, filters) {

	function importer (from) {
		debug('importing ', from);
		var imported = {};
		var joinPath = function () {
			return '.' + path.sep + path.join.apply(path, arguments);
		};
		var fsPath = joinPath(path.relative(process.cwd(), rel__dirname), from);
		fs.readdirSync(fsPath).forEach(function (name) {
			var matchingVar = 'match';
			var excludingVar = 'exclude';
			var isMatch = true;
			if (this.filters) {
				isMatch = filters[matchingVar] ? true : false;
			}
			var info = fs.statSync(path.join(fsPath, name));
			debug('recur');
			if (info.isDirectory()) {
				imported[name] = importer(joinPath(from, name));
			} else {
				// only import files that we can `require`
				var ext = path.extname(name);
				var base = path.basename(name, ext);
				if (require.extensions[ext]) {
					if (this.filters)
					{
						if (isMatch || (!isMatch && !minimatch(name, this.filters[excludingVar])))
						{
							imported[base] = require(path.join(rel__dirname, from, name));
						}
					}
					else
					{
						imported[base] = require(path.join(rel__dirname, from, name));
					}
				}
				else if (this.filters && isMatch && minimatch(name, this.filters[matchingVar]))
				{
					imported[base] = require(path.join(rel__dirname, from, name));
				}
				else {
					debug('cannot require ', ext);
				}
			}
		}, { filters: filters });

		return imported;
	}

	return importer;
}

module.exports = dispatchImporter;
