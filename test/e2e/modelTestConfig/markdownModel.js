var objectAssign = require('object-assign');
var TextField = require('../fieldTestObjects/textField');
var MarkdownField = require('../fieldTestObjects/markdownField');

module.exports = function MarkdownModel (config) {
	return {
		name: new TextField(objectAssign({}, config, {fieldName: 'name'})),
		fieldA: new MarkdownField(objectAssign({}, config, {fieldName: 'fieldA'})),
		fieldB: new MarkdownField(objectAssign({}, config, {fieldName: 'fieldB'})),
		fieldC: new MarkdownField(objectAssign({}, config, {fieldName: 'fieldC'})),
		fieldD: new TextField(objectAssign({}, config, {fieldName: 'fieldD'})),
	};
};
