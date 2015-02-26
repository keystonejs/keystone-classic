var keystone = require('keystone'),
	util = require('util'),
	super_ = require('../Type');

function localfiles(list, path, options) {
	var storeName = list.name + '-' + path.name;
	new keystone.Store(storeName, {
		adapter: 'local',
		dest: options.dest
	});
	return new keystone.Field.Types.Files(list, path, {
		store: storeName
	});
}

util.inherits(localfiles, super_);

module.exports = localfiles;
