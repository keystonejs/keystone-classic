var objectAssign = require('object-assign');
var TextFieldTestObject = require('../fieldTestObjects/TextFieldTestObject');
var LocationFieldTestObject = require('../fieldTestObjects/LocationFieldTestObject');

module.exports = function LocationModelTestConfig (config) {
	return {
		name: new TextFieldTestObject(objectAssign({}, config, {fieldName: 'name'})),
		fieldA: new LocationFieldTestObject(objectAssign({}, config, {fieldName: 'fieldA'})),
		fieldB: new LocationFieldTestObject(objectAssign({}, config, {fieldName: 'fieldB'})),
	};
};
