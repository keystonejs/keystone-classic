var objectAssign = require('object-assign');
var fieldTestObjectsPath = require('keystone-nightwatch-e2e').fieldTestObjectsPath;
var path = require('path');
var TextFieldTestObject = require(path.resolve(fieldTestObjectsPath, 'TextFieldTestObject'));
var MoneyFieldTestObject = require(path.resolve(fieldTestObjectsPath, 'MoneyFieldTestObject'));

module.exports = function MoneyModelTestConfig (config) {
	return {
		name: new TextFieldTestObject(objectAssign({}, config, {fieldName: 'name'})),
		fieldA: new MoneyFieldTestObject(objectAssign({}, config, {fieldName: 'fieldA'})),
		fieldB: new MoneyFieldTestObject(objectAssign({}, config, {fieldName: 'fieldB'})),
		fieldC: new MoneyFieldTestObject(objectAssign({}, config, {fieldName: 'fieldC'})),
		fieldD: new TextFieldTestObject(objectAssign({}, config, {fieldName: 'fieldD'})),
	};
};
