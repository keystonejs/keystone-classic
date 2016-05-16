var keystone = require('../../../../index.js');
var Types = keystone.Field.Types;

var Money = new keystone.List('Money', {
	autokey: {
		path: 'key',
		from: 'name',
		unique: true,
	},
	track: true,
});

Money.add({
	name: {
		type: String,
		initial: true,
		required: true,
		index: true,
	},
	fieldA: {
		type: Types.Money,
		initial: true,
	},
	fieldB: {
		type: Types.Money,
	},
});

Money.defaultColumns = 'name, fieldA, fieldB';
Money.register();

module.exports = Money;
