var listToArray = require('list-to-array');

function expandPaths (paths) {
	return listToArray(paths).map(function (path) {
		if (path === '__name__') {
			path = this.mappings.name;
		}
		return {
			path: path,
			field: this.fields[path],
		};
	}, this);
}

module.exports = expandPaths;
