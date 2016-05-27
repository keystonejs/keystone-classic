var keystone = require('../../../../index.js');
var Types = keystone.Field.Types;

var NoDefaultColumn = new keystone.List('NoDefaultColumn', {
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
