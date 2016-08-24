var objectAssign = require('object-assign');
var TextField = require('../fieldTestObjects/textField');
var EmailField = require('../fieldTestObjects/emailField');

module.exports = function EmailModel (config) {
	return {
		name: new TextField(objectAssign({}, config, {fieldName: 'name'})),
		fieldA: new EmailField(objectAssign({}, config, {fieldName: 'fieldA'})),
		fieldB: new EmailField(objectAssign({}, config, {fieldName: 'fieldB'})),
	};
};
