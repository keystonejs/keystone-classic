var objectAssign = require('object-assign');
var TextField = require('../fieldTestObjects/textField');
var PasswordField = require('../fieldTestObjects/passwordField');

module.exports = function PasswordModel (config) {
	return {
		name: new TextField(objectAssign({}, config, {fieldName: 'name'})),
		fieldA: new PasswordField(objectAssign({}, config, {fieldName: 'fieldA'})),
		fieldB: new PasswordField(objectAssign({}, config, {fieldName: 'fieldB'})),
		fieldC: new PasswordField(objectAssign({}, config, {fieldName: 'fieldC'})),
		fieldD: new TextField(objectAssign({}, config, {fieldName: 'fieldD'})),
	};
};
