var objectAssign = require('object-assign');
var fieldTestObjectsPath = require('keystone-nightwatch-e2e').fieldTestObjectsPath;
var path = require('path');
var TextFieldTestObject = require(path.resolve(fieldTestObjectsPath, 'TextFieldTestObject'));
var NumberFieldTestObject = require(path.resolve(fieldTestObjectsPath, 'NumberFieldTestObject'));

module.exports = function NumberModelTestConfig (config) {
	return {
		name: new TextFieldTestObject(objectAssign({}, config, {fieldName: 'name'})),
		fieldA: new NumberFieldTestObject(objectAssign({}, config, {fieldName: 'fieldA'})),
		fieldB: new NumberFieldTestObject(objectAssign({}, config, {fieldName: 'fieldB'})),
	};
};
