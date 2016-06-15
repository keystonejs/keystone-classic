var TextType = require('../fieldTypes/text');
var PasswordType = require('../fieldTypes/password');

module.exports = function PasswordList(config) {
	return {
		selector: '.Form',
		sections: {
			name: new TextType({fieldName: 'name'}),
			fieldA: new PasswordType({fieldName: 'fieldA'}),
			fieldB: new PasswordType({fieldName: 'fieldB'}),
		},
		commands: [{
			//
			// LIST LEVEL COMMANDS
			//
		}],
	};
};
