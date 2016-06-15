var keystone = require('../../../../index.js');
var Types = keystone.Field.Types;

var Url = new keystone.List('Url', {
	autokey: {
		path: 'key',
		from: 'name',
		unique: true,
	},
	track: true,
});

Url.add({
	name: {
		type: String,
		initial: true,
		required: true,
		index: true,
	},
	fieldA: {
		type: Types.Url,
		initial: true,
	},
	fieldB: {
		type: Types.Url,
	},
});

Url.defaultColumns = 'name, fieldA, fieldB';
Url.register();

module.exports = Url;
