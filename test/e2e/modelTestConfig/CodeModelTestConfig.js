var objectAssign = require('object-assign');
var CodeFieldTestObject = require('../fieldTestObjects/CodeFieldTestObject');
var TextFieldTestObject = require('../fieldTestObjects/TextFieldTestObject');

module.exports = function CodeModelTestConfig (config) {
	return {
		name: new TextFieldTestObject(objectAssign({}, config, {fieldName: 'name'})),
		fieldA: new CodeFieldTestObject(objectAssign({}, config, {fieldName: 'fieldA'})),
		fieldB: new CodeFieldTestObject(objectAssign({}, config, {fieldName: 'fieldB'})),
	};
};
