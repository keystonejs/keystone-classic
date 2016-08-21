var CloudinaryField = require('../fieldTestObjects/cloudinaryImageField');
var TextField = require('../fieldTestObjects/textField');

module.exports = function CloudinaryModel (config) {
	return {
		name: new TextField({fieldName: 'name'}),
		fieldA: new CloudinaryField({fieldName: 'fieldA'}),
		fieldB: new CloudinaryField({fieldName: 'fieldB'}),
	};
};
