var keystone = require('../../../../index.js');
var Types = keystone.Field.Types;

var CloudinaryImageMultiple = new keystone.List('CloudinaryImageMultiple', {
	autokey: {
		path: 'key',
		from: 'name',
		unique: true,
	},
	track: true,
});

CloudinaryImageMultiple.add({
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

CloudinaryImageMultiple.defaultColumns = 'name, fieldA, fieldB';
CloudinaryImageMultiple.register();

module.exports = CloudinaryImageMultiple;
