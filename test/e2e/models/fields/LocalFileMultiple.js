var keystone = require('../../../../index.js');
var Types = keystone.Field.Types;

var storage = new keystone.Storage({
	adapter: keystone.Storage.Adapters.FS,
	fs: {
		path: keystone.expandPath('./uploads'), // required; path where the files should be stored
		publicPath: '/public/uploads', // path where files will be served
	}
});

var LocalFileMultiple = new keystone.List('LocalFileMultiple', {
	autokey: {
		path: 'key',
		from: 'name',
		unique: true,
	},
	track: true,
});

LocalFileMultiple.add({
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

LocalFileMultiple.defaultColumns = 'name, fieldA, fieldB';
LocalFileMultiple.register();

module.exports = LocalFileMultiple;
