var objectAssign = require('object-assign');
var TextFieldTestObject = require('../fieldTestObjects/TextFieldTestObject');
var NumberArrayFieldTestObject = require('../fieldTestObjects/NumberArrayFieldTestObject');

module.exports = function NumberArrayModelTestConfig (config) {
	return {
		name: new TextFieldTestObject(objectAssign({}, config, {fieldName: 'name'})),
		fieldA: new NumberArrayFieldTestObject(objectAssign({}, config, {fieldName: 'fieldA'})),
		fieldB: new NumberArrayFieldTestObject(objectAssign({}, config, {fieldName: 'fieldB'})),
	};
};
