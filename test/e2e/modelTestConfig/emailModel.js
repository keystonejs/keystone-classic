var TextField = require('../fieldTestObjects/textField');
var EmailField = require('../fieldTestObjects/emailField');

module.exports = function EmailModel (config) {
	return {
		name: new TextField({fieldName: 'name'}),
		fieldA: new EmailField({fieldName: 'fieldA'}),
		fieldB: new EmailField({fieldName: 'fieldB'}),
	};
};
