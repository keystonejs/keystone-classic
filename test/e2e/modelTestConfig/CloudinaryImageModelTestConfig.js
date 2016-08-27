var objectAssign = require('object-assign');
var CloudinaryImageFieldTestObject = require('../fieldTestObjects/CloudinaryImageFieldTestObject');
var TextFieldTestObject = require('../fieldTestObjects/TextFieldTestObject');

module.exports = function CloudinaryImageModelTestConfig (config) {
	return {
		name: new TextFieldTestObject(objectAssign({}, config, {fieldName: 'name'})),
		fieldA: new CloudinaryImageFieldTestObject(objectAssign({}, config, {fieldName: 'fieldA'})),
		fieldB: new CloudinaryImageFieldTestObject(objectAssign({}, config, {fieldName: 'fieldB'})),
	};
};
