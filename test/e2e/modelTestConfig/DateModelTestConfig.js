var objectAssign = require('object-assign');
var fieldTestObjectsPath = require('keystone-nightwatch-e2e').fieldTestObjectsPath;
var path = require('path');
var TextFieldTestObject = require(path.resolve(fieldTestObjectsPath, 'TextFieldTestObject'));
var DateFieldTestObject = require(path.resolve(fieldTestObjectsPath, 'DateFieldTestObject'));

module.exports = function DateModelTestConfig (config) {
	return {
		name: new TextFieldTestObject(objectAssign({}, config, {fieldName: 'name'})),
		fieldA: new DateFieldTestObject(objectAssign({}, config, {fieldName: 'fieldA'})),
		fieldB: new DateFieldTestObject(objectAssign({}, config, {fieldName: 'fieldB'})),
	};
};
