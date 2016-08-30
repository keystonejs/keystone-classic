var objectAssign = require('object-assign');
var NameFieldTestObject = require('../fieldTestObjects/NameFieldTestObject');
var TextFieldTestObject = require('../fieldTestObjects/TextFieldTestObject');

module.exports = function NameModelTestConfig (config) {
	return {
		name: new TextFieldTestObject(objectAssign({}, config, {fieldName: 'name'})),
		fieldA: new NameFieldTestObject(objectAssign({}, config, {fieldName: 'fieldA'})),
		fieldB: new NameFieldTestObject(objectAssign({}, config, {fieldName: 'fieldB'})),
	};
};
