var keystone = require('../../../../index.js');
var Types = keystone.Field.Types;

var Html = new keystone.List('Html', {
	autokey: {
		path: 'key',
		from: 'name',
		unique: true,
	},
	track: true,
});

Html.add({
	name: {
		type: String,
		initial: true,
		required: true,
		index: true,
	},
	fieldA: {
		type: Types.Html,
		initial: true,
	},
	fieldB: {
		type: Types.Html,
	},
});

Html.defaultColumns = 'name, fieldA, fieldB';
Html.register();

module.exports = Html;
