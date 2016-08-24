var objectAssign = require('object-assign');
var TextField = require('../fieldTestObjects/textField');
var TextareaField = require('../fieldTestObjects/textareaField');

module.exports = function TextareaModel (config) {
	return {
		name: new TextField(objectAssign({}, config, {fieldName: 'name'})),
		fieldA: new TextareaField(objectAssign({}, config, {fieldName: 'fieldA'})),
		fieldB: new TextareaField(objectAssign({}, config, {fieldName: 'fieldB'})),
	};
};
