var objectAssign = require('object-assign');
var TextFieldTestObject = require('../../../../fieldTestObjects/TextFieldTestObject');

module.exports = function NoDefaultColumnsList(config) {
	return {
		fieldA: new TextFieldTestObject(objectAssign({}, config, {fieldName: 'fieldA'})),
		fieldB: new TextFieldTestObject(objectAssign({}, config, {fieldName: 'fieldB'})),
	};
};
