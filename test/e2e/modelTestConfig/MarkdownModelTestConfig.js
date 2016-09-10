var objectAssign = require('object-assign');
var fieldTestObjectsPath = require('keystone-nightwatch-e2e').fieldTestObjectsPath;
var path = require('path');
var TextFieldTestObject = require(path.resolve(fieldTestObjectsPath, 'TextFieldTestObject'));
var MarkdownFieldTestObject = require(path.resolve(fieldTestObjectsPath, 'MarkdownFieldTestObject'));

module.exports = function MarkdownModelTestConfig (config) {
	return {
		name: new TextFieldTestObject(objectAssign({}, config, {fieldName: 'name'})),
		fieldA: new MarkdownFieldTestObject(objectAssign({}, config, {fieldName: 'fieldA'})),
		fieldB: new MarkdownFieldTestObject(objectAssign({}, config, {fieldName: 'fieldB'})),
		fieldC: new MarkdownFieldTestObject(objectAssign({}, config, {fieldName: 'fieldC'})),
		fieldD: new TextFieldTestObject(objectAssign({}, config, {fieldName: 'fieldD'})),
	};
};
