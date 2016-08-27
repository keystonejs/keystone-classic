var objectAssign = require('object-assign');
var TextFieldTestObject = require('../fieldTestObjects/TextFieldTestObject');
var NumberFieldTestObject = require('../fieldTestObjects/NumberFieldTestObject');

module.exports = function NumberModelTestConfig (config) {
	return {
		name: new TextFieldTestObject(objectAssign({}, config, {fieldName: 'name'})),
		fieldA: new NumberFieldTestObject(objectAssign({}, config, {fieldName: 'fieldA'})),
		fieldB: new NumberFieldTestObject(objectAssign({}, config, {fieldName: 'fieldB'})),
	};
};
