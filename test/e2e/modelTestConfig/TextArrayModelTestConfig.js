var objectAssign = require('object-assign');
var fieldTestObjectsPath = require('keystone-nightwatch-e2e').fieldTestObjectsPath;
var path = require('path');
var TextFieldTestObject = require(path.resolve(fieldTestObjectsPath, 'TextFieldTestObject'));
var TextArrayFieldTestObject = require(path.resolve(fieldTestObjectsPath, 'TextArrayFieldTestObject'));

module.exports = function TextArrayModelTestConfig (config) {
	return {
		name: new TextFieldTestObject(objectAssign({}, config, {fieldName: 'name'})),
		fieldA: new TextArrayFieldTestObject(objectAssign({}, config, {fieldName: 'fieldA'})),
		fieldB: new TextArrayFieldTestObject(objectAssign({}, config, {fieldName: 'fieldB'})),
	};
};
