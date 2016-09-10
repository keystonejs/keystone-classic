var objectAssign = require('object-assign');
var fieldTestObjectsPath = require('keystone-nightwatch-e2e').fieldTestObjectsPath;
var path = require('path');
var TextFieldTestObject = require(path.resolve(fieldTestObjectsPath, 'TextFieldTestObject'));
var UrlFieldTestObject = require(path.resolve(fieldTestObjectsPath, 'UrlFieldTestObject'));

module.exports = function UrlModelTestConfig (config) {
	return {
		name: new TextFieldTestObject(objectAssign({}, config, {fieldName: 'name'})),
		fieldA: new UrlFieldTestObject(objectAssign({}, config, {fieldName: 'fieldA'})),
		fieldB: new UrlFieldTestObject(objectAssign({}, config, {fieldName: 'fieldB'})),
	};
};
