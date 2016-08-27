var objectAssign = require('object-assign');
var CloudinaryImageMultipleFieldTestObject = require('../fieldTestObjects/CloudinaryImageMultipleFieldTestObject');
var TextFieldTestObject = require('../fieldTestObjects/TextFieldTestObject');

module.exports = function CloudinaryImageMultipleModelTestConfig (config) {
	return {
		name: new TextFieldTestObject(objectAssign({}, config, {fieldName: 'name'})),
		fieldA: new CloudinaryImageMultipleFieldTestObject(objectAssign({}, config, {fieldName: 'fieldA'})),
		fieldB: new CloudinaryImageMultipleFieldTestObject(objectAssign({}, config, {fieldName: 'fieldB'})),
	};
};
