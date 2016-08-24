var objectAssign = require('object-assign');
var CloudinaryImageField = require('../fieldTestObjects/cloudinaryImageField');
var TextField = require('../fieldTestObjects/textField');

module.exports = function CloudinaryModel (config) {
	return {
		name: new TextField(objectAssign({}, config, {fieldName: 'name'})),
		fieldA: new CloudinaryImageField(objectAssign({}, config, {fieldName: 'fieldA'})),
		fieldB: new CloudinaryImageField(objectAssign({}, config, {fieldName: 'fieldB'})),
	};
};
