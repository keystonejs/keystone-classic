var TextField = require('../fieldTestObjects/textField');
var KeyField = require('../fieldTestObjects/keyField');

module.exports = function KeyModel (config) {
	return {
		name: new TextField({fieldName: 'name'}),
		fieldA: new KeyField({fieldName: 'fieldA'}),
		fieldB: new KeyField({fieldName: 'fieldB'}),
	};
};
