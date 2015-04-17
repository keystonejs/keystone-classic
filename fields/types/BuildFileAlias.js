var keystone = require('../../'),
	util = require('util'),
	_ = require('underscore'),
	super_ = require('./Type');

module.exports = function(adapter, multiple) {
	function file(list, path, options) {
		console.log('Keystone:','"'+adapter+'File" will be deprecated, please create a "'+adapter+'" Store and use "FileType"');
		var storeName = list.key + '-' + path;
		new keystone.Store(storeName, _.defaults({
			adapter: adapter
		}, options));
		var Field = keystone.Field.Types.File;
		if (multiple) Field = keystone.Field.Types.Files;
		return new Field(list, path, _.defaults({
			store: storeName
		}, options));
	}

	util.inherits(file, super_);

	return file;
};
