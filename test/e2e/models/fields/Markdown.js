var keystone = require('../../../../index.js');
var Types = keystone.Field.Types;

var Markdown = new keystone.List('Markdown', {
	autokey: {
		path: 'key',
		from: 'name',
		unique: true,
	},
	track: true,
});

Markdown.add({
	name: {
		type: String,
		initial: true,
		required: true,
		index: true,
	},
	fieldA: {
		type: Types.Markdown,
		initial: true,
		height: 200,
	},
	fieldB: {
		type: Types.Markdown,
		height: 200,
	},
});

Markdown.defaultColumns = 'name, fieldA, fieldB';
Markdown.register();

module.exports = Markdown;
