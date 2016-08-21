var CloudinaryImageField = require('../fieldTestObjects/cloudinaryImageField');
var TextField = require('../fieldTestObjects/textField');

module.exports = function CloudinaryModel (config) {
	return {
		name: new TextField({fieldName: 'name'}),
		fieldA: new CloudinaryImageField({fieldName: 'fieldA'}),
		fieldB: new CloudinaryImageField({fieldName: 'fieldB'}),
	};
};
