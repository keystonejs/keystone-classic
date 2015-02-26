var keystone = require('keystone'),
	util = require('util'),
	super_ = require('../Type');

function localfile(list, path, options) {
	var storeName = list.name + '-' + path.name;
	new keystone.Store(storeName, {
		adapter: 'local',
		dest: options.dest
	});
	return new keystone.Field.Types.File(list, path, {
		store: storeName
	});
}

util.inherits(localfile, super_);

module.exports = localfile;
