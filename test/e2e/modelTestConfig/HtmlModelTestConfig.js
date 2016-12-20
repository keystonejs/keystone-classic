var objectAssign = require('object-assign');
var fieldTestObjectsPath = require('keystone-nightwatch-e2e').fieldTestObjectsPath;
var path = require('path');
var TextFieldTestObject = require(path.resolve(fieldTestObjectsPath, 'TextFieldTestObject'));
var HtmlFieldTestObject = require(path.resolve(fieldTestObjectsPath, 'HtmlFieldTestObject'));

module.exports = function HtmlModelTestConfig (config) {
	return {
		name: new TextFieldTestObject(objectAssign({}, config, {fieldName: 'name'})),
		fieldA: new HtmlFieldTestObject(objectAssign({}, config, {fieldName: 'fieldA'})),
		fieldB: new HtmlFieldTestObject(objectAssign({}, config, {fieldName: 'fieldB'})),
	};
};
