var objectAssign = require('object-assign');
var TextFieldTestObject = require('../fieldTestObjects/TextFieldTestObject');

module.exports = function TextModelTestConfig (config) {
	return {
		name: new TextFieldTestObject(objectAssign({}, config, {fieldName: 'name'})),
		fieldA: new TextFieldTestObject(objectAssign({}, config, {fieldName: 'fieldA'})),
		fieldB: new TextFieldTestObject(objectAssign({}, config, {fieldName: 'fieldB'})),
	};
};
