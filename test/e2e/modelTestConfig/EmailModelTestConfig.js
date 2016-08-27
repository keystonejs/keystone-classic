var objectAssign = require('object-assign');
var TextFieldTestObject = require('../fieldTestObjects/TextFieldTestObject');
var EmailFieldTestObject = require('../fieldTestObjects/EmailFieldTestObject');

module.exports = function EmailModelTestConfig (config) {
	return {
		name: new TextFieldTestObject(objectAssign({}, config, {fieldName: 'name'})),
		fieldA: new EmailFieldTestObject(objectAssign({}, config, {fieldName: 'fieldA'})),
		fieldB: new EmailFieldTestObject(objectAssign({}, config, {fieldName: 'fieldB'})),
	};
};
