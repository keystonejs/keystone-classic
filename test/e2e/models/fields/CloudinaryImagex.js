var keystone = require('../../../../index.js');
var Types = keystone.Field.Types;

var CloudinaryImagex = new keystone.List('CloudinaryImagex', {
	autokey: {
		path: 'key',
		from: 'name',
		unique: true,
	},
	track: true,
});

CloudinaryImagex.add({
	name: {
		type: String,
		initial: true,
		required: true,
		index: true,
	},
	fieldA: {
		type: Types.CloudinaryImages,
	},
	fieldB: {
		type: Types.CloudinaryImages,
	},
});

CloudinaryImagex.defaultColumns = 'name, fieldA, fieldB';
CloudinaryImagex.register();

module.exports = CloudinaryImagex;
