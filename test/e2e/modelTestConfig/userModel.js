var NameField = require('../fieldTestObjects/nameField');
var EmailField = require('../fieldTestObjects/emailField');
var PasswordField = require('../fieldTestObjects/passwordField');
var TextField = require('../fieldTestObjects/textField');
var BooleanField = require('../fieldTestObjects/booleanField');

module.exports = function UserModel (config) {
	return {
		name: new NameField({fieldName: 'name'}),
		email: new EmailField({fieldName: 'email'}),
		password: new PasswordField({fieldName: 'password'}),
		resetPasswordKey: new TextField({fieldName: 'resetPasswordKey'}),
		isAdmin: new BooleanField({fieldName: 'isAdmin'}),
		isMember: new BooleanField({fieldName: 'isMember'}),
	};
};
