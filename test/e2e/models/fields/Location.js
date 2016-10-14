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
});

Location.defaultColumns = 'name, fieldA';
Location.register();

module.exports = Location;
