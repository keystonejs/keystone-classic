var keystone = require('../../../../index.js');
var Types = keystone.Field.Types;

var TextArraySelect = new keystone.List('TextArraySelect', {
	autokey: {
		path: 'key',
		from: 'name',
		unique: true,
	},
	track: true,
});

TextArraySelect.add({
	name: {
		type: String,
		initial: true,
		required: true,
		index: true,
	},
	fieldA: {
		type: Types.TextArray,
		default: ['One', 'Two']
	},
});

TextArraySelect.defaultColumns = 'name, fieldA';
TextArraySelect.register();

module.exports = TextArraySelect;
