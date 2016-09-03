var objectAssign = require('object-assign');
var fieldTestObjectsPath = require('keystone-nightwatch-e2e').fieldTestObjectsPath;
var path = require('path');
var TextFieldTestObject = require(path.resolve(fieldTestObjectsPath, 'TextFieldTestObject'));
var DatetimeFieldTestObject = require(path.resolve(fieldTestObjectsPath, 'DatetimeFieldTestObject'));

module.exports = function DatetimeModelTestConfig (config) {
	return {
		name: new TextFieldTestObject(objectAssign({}, config, {fieldName: 'name'})),
		fieldA: new DatetimeFieldTestObject(objectAssign({}, config, {fieldName: 'fieldA'})),
		fieldB: new DatetimeFieldTestObject(objectAssign({}, config, {fieldName: 'fieldB'})),
	};
};
