var keystone = require('../../../../index.js');
var Types = keystone.Field.Types;

var NumberArray = new keystone.List('NumberArray', {
	autokey: {
		path: 'key',
		from: 'name',
		unique: true,
	},
	track: true,
});

NumberArray.add({
	name: {
		type: String,
		initial: true,
		required: true,
		index: true,
	},
	fieldA: {
		type: Types.NumberArray,
	}
});

NumberArray.defaultColumns = 'name, fieldA';
NumberArray.register();

module.exports = NumberArray;
