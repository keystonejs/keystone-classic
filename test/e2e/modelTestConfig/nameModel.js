var objectAssign = require('object-assign');
var NameField = require('../fieldTestObjects/nameField');
var TextField = require('../fieldTestObjects/textField');

module.exports = function NameModel (config) {
	return {
		name: new TextField(objectAssign({}, config, {fieldName: 'name'})),
		fieldA: new NameField(objectAssign({}, config, {fieldName: 'fieldA'})),
		fieldB: new NameField(objectAssign({}, config, {fieldName: 'fieldB'})),
	};
};
