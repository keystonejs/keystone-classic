//TODO:  uncomment all commented lines when field page object support exists
//var BooleanType = require('../fieldTypes/boolean');
//var EmailType = require('../fieldTypes/email');
var NameType = require('../fieldTypes/name');
//var PasswordType = require('../fieldTypes/password');
var TextType = require('../fieldTypes/text');

module.exports = function UserList(config) {
	return {
		selector: '.Form',
		sections: {
			name: new NameType({fieldName: 'name'}),
			//email: new EmailType({fieldName: 'email'}),
			//password: new PasswordType({fieldName: 'password'}),
			resetPasswordKey: new TextType({fieldName: 'resetPasswordKey'}),
			//isAdmin: new BooleanType({fieldName: 'isAdmin'}),
			//isMember: new BooleanType({fieldName: 'isMember'}),
		},
		commands: [{
			//
			// LIST LEVEL COMMANDS
			//
		}],
	};
};
