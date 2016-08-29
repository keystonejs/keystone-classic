var objectAssign = require('object-assign');
var TextFieldTestObject = require('../fieldTestObjects/TextFieldTestObject');
var DateArrayFieldTestObject = require('../fieldTestObjects/DateArrayFieldTestObject');

module.exports = function DateArrayModelTestConfig (config) {
	return {
		name: new TextFieldTestObject(objectAssign({}, config, {fieldName: 'name'})),
		fieldA: new DateArrayFieldTestObject(objectAssign({}, config, {fieldName: 'fieldA'})),
		fieldB: new DateArrayFieldTestObject(objectAssign({}, config, {fieldName: 'fieldB'})),
	};
};
