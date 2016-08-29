var objectAssign = require('object-assign');
var TextFieldTestObject = require('../fieldTestObjects/TextFieldTestObject');
var ColorFieldTestObject = require('../fieldTestObjects/ColorFieldTestObject');

module.exports = function ColorModelTestConfig (config) {
	return {
		name: new TextFieldTestObject(objectAssign({}, config, {fieldName: 'name'})),
		fieldA: new ColorFieldTestObject(objectAssign({}, config, {fieldName: 'fieldA'})),
		fieldB: new ColorFieldTestObject(objectAssign({}, config, {fieldName: 'fieldB'})),
	};
};
