var objectAssign = require('object-assign');
var fieldTestObjectsPath = require('keystone-nightwatch-e2e').fieldTestObjectsPath;
var path = require('path');
var TextFieldTestObject = require(path.resolve(fieldTestObjectsPath, 'TextFieldTestObject'));
var FileFieldTestObject = require(path.resolve(fieldTestObjectsPath, 'FileFieldTestObject'));

module.exports = function FileModelTestConfig (config) {
	return {
		name: new TextFieldTestObject(objectAssign({}, config, {fieldName: 'name'})),
		fieldA: new FileFieldTestObject(objectAssign({}, config, {fieldName: 'fieldA'})),
		fieldB: new FileFieldTestObject(objectAssign({}, config, {fieldName: 'fieldB'})),
	};
};
