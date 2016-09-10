var keystone = require('../../../../index.js');
var Types = keystone.Field.Types;

var Relationship = new keystone.List('Relationship', {
	autokey: {
		path: 'key',
		from: 'name',
		unique: true,
	},
	track: true,
});

Relationship.add({
	name: {
		type: String,
		initial: true,
		required: true,
		index: true,
	},
	fieldA: {
		type: Types.Relationship,
		ref: 'User',
		inline: true,
		initial: true,
	},
	fieldB: {
		type: Types.Relationship,
		ref: 'User',
	},
});

Relationship.defaultColumns = 'name, fieldA, fieldB';
Relationship.register();

module.exports = Relationship;
