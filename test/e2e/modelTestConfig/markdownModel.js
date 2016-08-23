var TextField = require('../fieldTestObjects/textField');
var MarkdownField = require('../fieldTestObjects/markdownField');

module.exports = function MarkdownModel (config) {
	return {
		name: new TextField({fieldName: 'name'}),
		fieldA: new MarkdownField({fieldName: 'fieldA'}),
		fieldB: new MarkdownField({fieldName: 'fieldB'}),
		fieldC: new MarkdownField({fieldName: 'fieldC'}),
		fieldD: new TextField({fieldName: 'fieldD'}),
	};
};
