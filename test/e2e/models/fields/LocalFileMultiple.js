var keystone = require('../../../../index.js');
var Types = keystone.Field.Types;

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
		type: Types.LocalFiles,
		dest: '/files/',
	},
	fieldB: {
		type: Types.LocalFiles,
		dest: '/files/',
	},
});

LocalFileMultiple.defaultColumns = 'name, fieldA, fieldB';
LocalFileMultiple.register();

module.exports = LocalFileMultiple;
