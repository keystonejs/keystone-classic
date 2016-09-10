var objectAssign = require('object-assign');
var fieldTestObjectsPath = require('keystone-nightwatch-e2e').fieldTestObjectsPath;
var path = require('path');
var NameFieldTestObject = require(path.resolve(fieldTestObjectsPath, 'NameFieldTestObject'));
var EmailFieldTestObject = require(path.resolve(fieldTestObjectsPath, 'EmailFieldTestObject'));
var PasswordFieldTestObject = require(path.resolve(fieldTestObjectsPath, 'PasswordFieldTestObject'));
var TextFieldTestObject = require(path.resolve(fieldTestObjectsPath, 'TextFieldTestObject'));
var BooleanFieldTestObject = require(path.resolve(fieldTestObjectsPath, 'BooleanFieldTestObject'));

module.exports = function UserModelTestConfig (config) {
	return {
		name: new NameFieldTestObject(objectAssign({}, config, {fieldName: 'name'})),
		email: new EmailFieldTestObject(objectAssign({}, config, {fieldName: 'email'})),
		password: new PasswordFieldTestObject(objectAssign({}, config, {fieldName: 'password'})),
		resetPasswordKey: new TextFieldTestObject(objectAssign({}, config, {fieldName: 'resetPasswordKey'})),
		isAdmin: new BooleanFieldTestObject(objectAssign({}, config, {fieldName: 'isAdmin'})),
		isMember: new BooleanFieldTestObject(objectAssign({}, config, {fieldName: 'isMember'})),
	};
};
