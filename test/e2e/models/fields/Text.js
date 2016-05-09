var keystone = require('../../../../index.js');
var Types = keystone.Field.Types;

var Text = new keystone.List('Text', {
	autokey: {
		path: 'key',
		from: 'name',
		unique: true,
	},
	track: true,
});

Text.add({
	name: {
		type: String,
		initial: true,
		required: true,
		index: true,
	},
	fieldA: {
		type: Types.Text,
		initial: true,
	},
	fieldB: {
		type: Types.Text,
	},
});

Text.defaultColumns = 'name, fieldA, fieldB';
Text.register();

module.exports = Text;
