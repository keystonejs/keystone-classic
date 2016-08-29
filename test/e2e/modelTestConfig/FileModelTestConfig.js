var objectAssign = require('object-assign');
var TextFieldTestObject = require('../fieldTestObjects/TextFieldTestObject');
var FileFieldTestObject = require('../fieldTestObjects/FileFieldTestObject');

module.exports = function FileModelTestConfig (config) {
	return {
		name: new TextFieldTestObject(objectAssign({}, config, {fieldName: 'name'})),
		fieldA: new FileFieldTestObject(objectAssign({}, config, {fieldName: 'fieldA'})),
		fieldB: new FileFieldTestObject(objectAssign({}, config, {fieldName: 'fieldB'})),
	};
};
