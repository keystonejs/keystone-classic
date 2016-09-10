var objectAssign = require('object-assign');
var fieldTestObjectsPath = require('keystone-nightwatch-e2e').fieldTestObjectsPath;
var path = require('path');
var TextFieldTestObject = require(path.resolve(fieldTestObjectsPath, 'TextFieldTestObject'));
var PasswordFieldTestObject = require(path.resolve(fieldTestObjectsPath, 'PasswordFieldTestObject'));

module.exports = function PasswordModelTestConfig (config) {
	return {
		name: new TextFieldTestObject(objectAssign({}, config, {fieldName: 'name'})),
		fieldA: new PasswordFieldTestObject(objectAssign({}, config, {fieldName: 'fieldA'})),
		fieldB: new PasswordFieldTestObject(objectAssign({}, config, {fieldName: 'fieldB'})),
		fieldC: new PasswordFieldTestObject(objectAssign({}, config, {fieldName: 'fieldC'})),
		fieldD: new TextFieldTestObject(objectAssign({}, config, {fieldName: 'fieldD'})),
	};
};
