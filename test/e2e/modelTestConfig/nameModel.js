var NameField = require('../fieldTestObjects/nameField');
var TextField = require('../fieldTestObjects/textField');

module.exports = function NameList(config) {
	return {
		name: new TextField({fieldName: 'name'}),
		fieldA: new NameField({fieldName: 'fieldA'}),
		fieldB: new NameField({fieldName: 'fieldB'}),
	};
};
