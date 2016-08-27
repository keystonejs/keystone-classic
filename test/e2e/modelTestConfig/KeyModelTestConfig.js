var objectAssign = require('object-assign');
var TextFieldTestObject = require('../fieldTestObjects/TextFieldTestObject');
var KeyFieldTestObject = require('../fieldTestObjects/KeyFieldTestObject');

module.exports = function KeyModelTestConfig (config) {
	return {
		name: new TextFieldTestObject(objectAssign({}, config, {fieldName: 'name'})),
		fieldA: new KeyFieldTestObject(objectAssign({}, config, {fieldName: 'fieldA'})),
		fieldB: new KeyFieldTestObject(objectAssign({}, config, {fieldName: 'fieldB'})),
	};
};
