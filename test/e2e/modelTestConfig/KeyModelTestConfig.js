var objectAssign = require('object-assign');
var fieldTestObjectsPath = require('keystone-nightwatch-e2e').fieldTestObjectsPath;
var path = require('path');
var TextFieldTestObject = require(path.resolve(fieldTestObjectsPath, 'TextFieldTestObject'));
var KeyFieldTestObject = require(path.resolve(fieldTestObjectsPath, 'KeyFieldTestObject'));

module.exports = function KeyModelTestConfig (config) {
	return {
		name: new TextFieldTestObject(objectAssign({}, config, {fieldName: 'name'})),
		fieldA: new KeyFieldTestObject(objectAssign({}, config, {fieldName: 'fieldA'})),
		fieldB: new KeyFieldTestObject(objectAssign({}, config, {fieldName: 'fieldB'})),
	};
};
