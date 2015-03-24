var keystone = require('../../'),
	util = require('util'),
	super_ = require('./Type');

module.exports = function(adapter, multiple) {
	function file(list, path, options) {
		var storeName = list.name + '-' + path.name;
		new keystone.Store(storeName, {
			adapter: adapter,
			dest: options.dest
		});

		var Field = keystone.Field.Types.File;
		if (multiple) Field = keystone.Field.Types.Files;
		return new Field(list, path, {
			store: storeName
		});
	}

	util.inherits(file, super_);

	return file;
};
