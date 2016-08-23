var TextField = require('../fieldTestObjects/textField');
var PasswordField = require('../fieldTestObjects/passwordField');

module.exports = function PasswordModel (config) {
	return {
		name: new TextField({fieldName: 'name'}),
		fieldA: new PasswordField({fieldName: 'fieldA'}),
		fieldB: new PasswordField({fieldName: 'fieldB'}),
		fieldC: new PasswordField({fieldName: 'fieldC'}),
		fieldD: new TextField({fieldName: 'fieldD'}),
	};
};
