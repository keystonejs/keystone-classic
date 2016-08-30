var objectAssign = require('object-assign');
var TextFieldTestObject = require('../fieldTestObjects/TextFieldTestObject');
var BooleanFieldTestObject = require('../fieldTestObjects/BooleanFieldTestObject');

module.exports = function BooleanModelTestConfig (config) {
	return {
		name: new TextFieldTestObject(objectAssign({}, config, {fieldName: 'name'})),
		fieldA: new BooleanFieldTestObject(objectAssign({}, config, {fieldName: 'fieldA'})),
		fieldB: new BooleanFieldTestObject(objectAssign({}, config, {fieldName: 'fieldB'})),
		fieldC: new BooleanFieldTestObject(objectAssign({}, config, {fieldName: 'fieldC'})),
		fieldD: new TextFieldTestObject(objectAssign({}, config, {fieldName: 'fieldD'})),
	};
};
