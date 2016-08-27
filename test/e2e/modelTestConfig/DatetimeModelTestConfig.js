var objectAssign = require('object-assign');
var TextFieldTestObject = require('../fieldTestObjects/TextFieldTestObject');
var DatetimeFieldTestObject = require('../fieldTestObjects/DatetimeFieldTestObject');

module.exports = function DatetimeModelTestConfig (config) {
	return {
		name: new TextFieldTestObject(objectAssign({}, config, {fieldName: 'name'})),
		fieldA: new DatetimeFieldTestObject(objectAssign({}, config, {fieldName: 'fieldA'})),
		fieldB: new DatetimeFieldTestObject(objectAssign({}, config, {fieldName: 'fieldB'})),
	};
};
