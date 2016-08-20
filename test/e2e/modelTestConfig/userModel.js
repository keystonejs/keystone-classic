var NameField = require('../fieldTestObjects/nameField');
var TextField = require('../fieldTestObjects/textField');

module.exports = function UserList(config) {
	return {
		name: new NameField({fieldName: 'name'}),
		resetPasswordKey: new TextField({fieldName: 'resetPasswordKey'}),
	};
};
