var CloudinaryImageMultipleField = require('../fieldTestObjects/cloudinaryImageMultipleField');
var TextField = require('../fieldTestObjects/textField');

module.exports = function CloudinaryModel (config) {
	return {
		name: new TextField({fieldName: 'name'}),
		fieldA: new CloudinaryImageMultipleField({fieldName: 'fieldA'}),
		fieldB: new CloudinaryImageMultipleField({fieldName: 'fieldB'}),
	};
};
