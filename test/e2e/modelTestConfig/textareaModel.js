var TextField = require('../fieldTestObjects/textField');
var TextareaField = require('../fieldTestObjects/textareaField');

module.exports = function TextareaModel (config) {
	return {
		name: new TextField({fieldName: 'name'}),
		fieldA: new TextareaField({fieldName: 'fieldA'}),
		fieldB: new TextareaField({fieldName: 'fieldB'}),
	};
};
