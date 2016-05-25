var keystone = require('../../../../index.js');
var Types = keystone.Field.Types;

// Model to demonstrate issue #2945

var NoDefaultColumn = new keystone.List('NoDefaultColumn', {
	autokey: {
		path: 'key',
		from: 'name',
		unique: true,
	},
	track: true,
});

NoDefaultColumn.add({
	fieldA: {
		type: Types.Text,
		initial: true,
	},
	fieldB: {
		type: Types.Text,
	},
});

NoDefaultColumn.register();

module.exports = NoDefaultColumn;
