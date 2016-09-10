var objectAssign = require('object-assign');
var fieldTestObjectsPath = require('keystone-nightwatch-e2e').fieldTestObjectsPath;
var path = require('path');
var TextFieldTestObject = require(path.resolve(fieldTestObjectsPath, 'TextFieldTestObject'));
var NumberArrayFieldTestObject = require(path.resolve(fieldTestObjectsPath, 'NumberArrayFieldTestObject'));

module.exports = function NumberArrayModelTestConfig (config) {
	return {
		name: new TextFieldTestObject(objectAssign({}, config, {fieldName: 'name'})),
		fieldA: new NumberArrayFieldTestObject(objectAssign({}, config, {fieldName: 'fieldA'})),
		fieldB: new NumberArrayFieldTestObject(objectAssign({}, config, {fieldName: 'fieldB'})),
	};
};
