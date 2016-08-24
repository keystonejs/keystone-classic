var objectAssign = require('object-assign');
var NameField = require('../fieldTestObjects/nameField');
var EmailField = require('../fieldTestObjects/emailField');
var PasswordField = require('../fieldTestObjects/passwordField');
var TextField = require('../fieldTestObjects/textField');
var BooleanField = require('../fieldTestObjects/booleanField');

module.exports = function UserModel (config) {
	return {
		name: new NameField(objectAssign({}, config, {fieldName: 'name'})),
		email: new EmailField(objectAssign({}, config, {fieldName: 'email'})),
		password: new PasswordField(objectAssign({}, config, {fieldName: 'password'})),
		resetPasswordKey: new TextField(objectAssign({}, config, {fieldName: 'resetPasswordKey'})),
		isAdmin: new BooleanField(objectAssign({}, config, {fieldName: 'isAdmin'})),
		isMember: new BooleanField(objectAssign({}, config, {fieldName: 'isMember'})),
	};
};
