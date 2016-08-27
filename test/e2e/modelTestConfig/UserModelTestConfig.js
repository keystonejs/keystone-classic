var objectAssign = require('object-assign');
var NameFieldTestObject = require('../fieldTestObjects/NameFieldTestObject');
var EmailFieldTestObject = require('../fieldTestObjects/EmailFieldTestObject');
var PasswordFieldTestObject = require('../fieldTestObjects/PasswordFieldTestObject');
var TextFieldTestObject = require('../fieldTestObjects/TextFieldTestObject');
var BooleanFieldTestObject = require('../fieldTestObjects/BooleanFieldTestObject');

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
