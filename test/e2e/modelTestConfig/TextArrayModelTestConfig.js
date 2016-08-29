var objectAssign = require('object-assign');
var TextFieldTestObject = require('../fieldTestObjects/TextFieldTestObject');
var TextArrayFieldTestObject = require('../fieldTestObjects/TextArrayFieldTestObject');

module.exports = function TextArrayModelTestConfig (config) {
	return {
		name: new TextFieldTestObject(objectAssign({}, config, {fieldName: 'name'})),
		fieldA: new TextArrayFieldTestObject(objectAssign({}, config, {fieldName: 'fieldA'})),
		fieldB: new TextArrayFieldTestObject(objectAssign({}, config, {fieldName: 'fieldB'})),
	};
};
