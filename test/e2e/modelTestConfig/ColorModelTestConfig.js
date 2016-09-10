var objectAssign = require('object-assign');
var fieldTestObjectsPath = require('keystone-nightwatch-e2e').fieldTestObjectsPath;
var path = require('path');
var TextFieldTestObject = require(path.resolve(fieldTestObjectsPath, 'TextFieldTestObject'));
var ColorFieldTestObject = require(path.resolve(fieldTestObjectsPath, 'ColorFieldTestObject'));

module.exports = function ColorModelTestConfig (config) {
	return {
		name: new TextFieldTestObject(objectAssign({}, config, {fieldName: 'name'})),
		fieldA: new ColorFieldTestObject(objectAssign({}, config, {fieldName: 'fieldA'})),
		fieldB: new ColorFieldTestObject(objectAssign({}, config, {fieldName: 'fieldB'})),
	};
};
