var objectAssign = require('object-assign');
var TextFieldTestObject = require('../fieldTestObjects/TextFieldTestObject');
var MarkdownFieldTestObject = require('../fieldTestObjects/MarkdownFieldTestObject');

module.exports = function MarkdownModelTestConfig (config) {
	return {
		name: new TextFieldTestObject(objectAssign({}, config, {fieldName: 'name'})),
		fieldA: new MarkdownFieldTestObject(objectAssign({}, config, {fieldName: 'fieldA'})),
		fieldB: new MarkdownFieldTestObject(objectAssign({}, config, {fieldName: 'fieldB'})),
		fieldC: new MarkdownFieldTestObject(objectAssign({}, config, {fieldName: 'fieldC'})),
		fieldD: new TextFieldTestObject(objectAssign({}, config, {fieldName: 'fieldD'})),
	};
};
