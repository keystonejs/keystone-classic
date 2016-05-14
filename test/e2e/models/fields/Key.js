var keystone = require('../../../../index.js');
var Types = keystone.Field.Types;

var Key = new keystone.List('Key', {
	autokey: {
		path: 'key',
		from: 'name',
		unique: true,
	},
	track: true,
});

Key.add({
	name: {
		type: String,
		initial: true,
		required: true,
		index: true,
	},
	fieldA: {
		type: Types.Key,
		initial: true,
	},
	fieldB: {
		type: Types.Key,
	},
});

Key.defaultColumns = 'name, fieldA, fieldB';
Key.register();

module.exports = Key;
