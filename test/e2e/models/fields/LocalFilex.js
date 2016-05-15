var keystone = require('../../../../index.js');
var Types = keystone.Field.Types;

var LocalFilex = new keystone.List('LocalFilex', {
	autokey: {
		path: 'key',
		from: 'name',
		unique: true,
	},
	track: true,
});

LocalFilex.add({
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

LocalFilex.defaultColumns = 'name, fieldA, fieldB';
LocalFilex.register();

module.exports = LocalFilex;
