var objectAssign = require('object-assign');
var SelectFieldTestObject = require('../fieldTestObjects/SelectFieldTestObject');
var TextFieldTestObject = require('../fieldTestObjects/TextFieldTestObject');

module.exports = function SelectModelTestConfig(config) {
	return {
		name: new TextFieldTestObject(objectAssign({}, config, {fieldName: 'name'})),
		fieldA: new SelectFieldTestObject(objectAssign({}, config, {fieldName: 'fieldA'})),
		fieldB: new SelectFieldTestObject(objectAssign({}, config, {fieldName: 'fieldB'})),
	};
};
