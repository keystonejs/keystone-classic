var keystone = require('../../../../index.js');
var Types = keystone.Field.Types;

var Datetime = new keystone.List('Datetime', {
	autokey: {
		path: 'key',
		from: 'name',
		unique: true,
	},
	track: true,
});

Datetime.add({
	name: {
		type: String,
		initial: true,
		required: true,
		index: true,
	},
	fieldA: {
		type: Types.Datetime,
		initial: true,
	},
	fieldB: {
		type: Types.Datetime,
	},
});

Datetime.defaultColumns = 'name, fieldA, fieldB';
Datetime.register();

module.exports = Datetime;
