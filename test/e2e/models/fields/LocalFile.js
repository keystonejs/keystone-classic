var keystone = require('../../../../index.js');
var Types = keystone.Field.Types;

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
		type: Types.LocalFile,
		dest: '/files/',
	},
	fieldB: {
		type: Types.LocalFile,
		dest: '/files/',
	},
});

LocalFile.defaultColumns = 'name, fieldA, fieldB';
LocalFile.register();

module.exports = LocalFile;
