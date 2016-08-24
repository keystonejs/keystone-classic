var objectAssign = require('object-assign');
var CloudinaryImageMultipleField = require('../fieldTestObjects/cloudinaryImageMultipleField');
var TextField = require('../fieldTestObjects/textField');

module.exports = function CloudinaryModel (config) {
	return {
		name: new TextField(objectAssign({}, config, {fieldName: 'name'})),
		fieldA: new CloudinaryImageMultipleField(objectAssign({}, config, {fieldName: 'fieldA'})),
		fieldB: new CloudinaryImageMultipleField(objectAssign({}, config, {fieldName: 'fieldB'})),
	};
};
