var objectAssign = require('object-assign');
var TextFieldTestObject = require('../fieldTestObjects/TextFieldTestObject');
var DateFieldTestObject = require('../fieldTestObjects/DateFieldTestObject');

module.exports = function DateModelTestConfig (config) {
	return {
		name: new TextFieldTestObject(objectAssign({}, config, {fieldName: 'name'})),
		fieldA: new DateFieldTestObject(objectAssign({}, config, {fieldName: 'fieldA'})),
		fieldB: new DateFieldTestObject(objectAssign({}, config, {fieldName: 'fieldB'})),
	};
};
