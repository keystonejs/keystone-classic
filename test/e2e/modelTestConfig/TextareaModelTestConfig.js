var objectAssign = require('object-assign');
var fieldTestObjectsPath = require('keystone-nightwatch-e2e').fieldTestObjectsPath;
var path = require('path');
var TextFieldTestObject = require(path.resolve(fieldTestObjectsPath, 'TextFieldTestObject'));
var TextareaFieldTestObject = require(path.resolve(fieldTestObjectsPath, 'TextareaFieldTestObject'));

module.exports = function TextareaModelTestConfig (config) {
	return {
		name: new TextFieldTestObject(objectAssign({}, config, {fieldName: 'name'})),
		fieldA: new TextareaFieldTestObject(objectAssign({}, config, {fieldName: 'fieldA'})),
		fieldB: new TextareaFieldTestObject(objectAssign({}, config, {fieldName: 'fieldB'})),
	};
};
