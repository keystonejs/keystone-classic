var objectAssign = require('object-assign');
var fieldTestObjectsPath = require('keystone-nightwatch-e2e').fieldTestObjectsPath;
var path = require('path');
var TextFieldTestObject = require(path.resolve(fieldTestObjectsPath, 'TextFieldTestObject'));
var LocationFieldTestObject = require(path.resolve(fieldTestObjectsPath, 'LocationFieldTestObject'));

module.exports = function LocationModelTestConfig (config) {
	return {
		name: new TextFieldTestObject(objectAssign({}, config, {fieldName: 'name'})),
		fieldA: new LocationFieldTestObject(objectAssign({}, config, {fieldName: 'fieldA'})),
		fieldB: new LocationFieldTestObject(objectAssign({}, config, {fieldName: 'fieldB'})),
	};
};
