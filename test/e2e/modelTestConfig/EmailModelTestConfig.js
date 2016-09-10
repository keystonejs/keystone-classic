var objectAssign = require('object-assign');
var fieldTestObjectsPath = require('keystone-nightwatch-e2e').fieldTestObjectsPath;
var path = require('path');
var TextFieldTestObject = require(path.resolve(fieldTestObjectsPath, 'TextFieldTestObject'));
var EmailFieldTestObject = require(path.resolve(fieldTestObjectsPath, 'EmailFieldTestObject'));

module.exports = function EmailModelTestConfig (config) {
	return {
		name: new TextFieldTestObject(objectAssign({}, config, {fieldName: 'name'})),
		fieldA: new EmailFieldTestObject(objectAssign({}, config, {fieldName: 'fieldA'})),
		fieldB: new EmailFieldTestObject(objectAssign({}, config, {fieldName: 'fieldB'})),
	};
};
