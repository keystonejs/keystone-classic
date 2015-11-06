var path = require('path');

module.exports = function(module) {
	var parts = module.paths[0].split(path.sep);
	parts.pop(); //get rid of /node_modules from the end of the path
	return parts.join(path.sep);
}
