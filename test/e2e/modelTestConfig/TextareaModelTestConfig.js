var objectAssign = require('object-assign');
var TextFieldTestObject = require('../fieldTestObjects/TextFieldTestObject');
var TextareaFieldTestObject = require('../fieldTestObjects/TextareaFieldTestObject');

module.exports = function TextareaModelTestConfig (config) {
	return {
		name: new TextFieldTestObject(objectAssign({}, config, {fieldName: 'name'})),
		fieldA: new TextareaFieldTestObject(objectAssign({}, config, {fieldName: 'fieldA'})),
		fieldB: new TextareaFieldTestObject(objectAssign({}, config, {fieldName: 'fieldB'})),
	};
};
