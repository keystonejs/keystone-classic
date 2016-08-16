var keystone = require('../../../../index.js');
var Types = keystone.Field.Types;

var storage = new keystone.Storage({
	adapter: keystone.Storage.Adapters.FS,
	fs: {
		path: keystone.expandPath('./uploads'), // required; path where the files should be stored
		publicPath: '/public/uploads', // path where files will be served
	}
});

var LocalFile = new keystone.List('LocalFile', {
	autokey: {
		path: 'key',
		from: 'name',
		unique: true,
	},
	track: true,
});

LocalFile.add({
	name: {
		type: String,
		initial: true,
		required: true,
		index: true,
	},
	fieldA: {
		type: Types.File,
		storage: storage,
	},
	fieldB: {
		type: Types.File,
		storage: storage,
	},
});

LocalFile.defaultColumns = 'name, fieldA, fieldB';
LocalFile.register();

module.exports = LocalFile;
