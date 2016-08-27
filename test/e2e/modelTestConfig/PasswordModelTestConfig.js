var objectAssign = require('object-assign');
var TextFieldTestObject = require('../fieldTestObjects/TextFieldTestObject');
var PasswordFieldTestObject = require('../fieldTestObjects/PasswordFieldTestObject');

module.exports = function PasswordModelTestConfig (config) {
	return {
		name: new TextFieldTestObject(objectAssign({}, config, {fieldName: 'name'})),
		fieldA: new PasswordFieldTestObject(objectAssign({}, config, {fieldName: 'fieldA'})),
		fieldB: new PasswordFieldTestObject(objectAssign({}, config, {fieldName: 'fieldB'})),
		fieldC: new PasswordFieldTestObject(objectAssign({}, config, {fieldName: 'fieldC'})),
		fieldD: new TextFieldTestObject(objectAssign({}, config, {fieldName: 'fieldD'})),
	};
};
