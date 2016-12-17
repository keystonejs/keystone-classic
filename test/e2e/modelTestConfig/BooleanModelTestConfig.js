var objectAssign = require('object-assign');
var fieldTestObjectsPath = require('keystone-nightwatch-e2e').fieldTestObjectsPath;
var path = require('path');
var TextFieldTestObject = require(path.resolve(fieldTestObjectsPath, 'TextFieldTestObject'));
var BooleanFieldTestObject = require(path.resolve(fieldTestObjectsPath, 'BooleanFieldTestObject'));

module.exports = function BooleanModelTestConfig (config) {
	return {
		name: new TextFieldTestObject(objectAssign({}, config, {fieldName: 'name'})),
		fieldA: new BooleanFieldTestObject(objectAssign({}, config, {fieldName: 'fieldA'})),
		fieldB: new BooleanFieldTestObject(objectAssign({}, config, {fieldName: 'fieldB'})),
		fieldC: new BooleanFieldTestObject(objectAssign({}, config, {fieldName: 'fieldC'})),
		fieldD: new TextFieldTestObject(objectAssign({}, config, {fieldName: 'fieldD'})),
	};
};
