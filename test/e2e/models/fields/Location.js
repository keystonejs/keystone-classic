var keystone = require('../../../../index.js');
var Types = keystone.Field.Types;

var Location = new keystone.List('Location', {
	autokey: {
		path: 'key',
		from: 'name',
		unique: true,
	},
	track: true,
});

Location.add({
	name: {
		type: String,
		initial: true,
		required: true,
		index: true,
	},
	fieldA: {
		type: Types.Location,
		initial: true,
	},
	fieldB: {
		type: Types.Location,
	},
});

Location.defaultColumns = 'name, fieldA, fieldB';
Location.register();

module.exports = Location;
