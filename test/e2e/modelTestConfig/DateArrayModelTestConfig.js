var objectAssign = require('object-assign');
var fieldTestObjectsPath = require('keystone-nightwatch-e2e').fieldTestObjectsPath;
var path = require('path');
var TextFieldTestObject = require(path.resolve(fieldTestObjectsPath, 'TextFieldTestObject'));
var DateArrayFieldTestObject = require(path.resolve(fieldTestObjectsPath, 'DateArrayFieldTestObject'));

module.exports = function DateArrayModelTestConfig (config) {
	return {
		name: new TextFieldTestObject(objectAssign({}, config, {fieldName: 'name'})),
		fieldA: new DateArrayFieldTestObject(objectAssign({}, config, {fieldName: 'fieldA'})),
		fieldB: new DateArrayFieldTestObject(objectAssign({}, config, {fieldName: 'fieldB'})),
	};
};
