var objectAssign = require('object-assign');
var TextFieldTestObject = require('../fieldTestObjects/TextFieldTestObject');
var MoneyFieldTestObject = require('../fieldTestObjects/MoneyFieldTestObject');

module.exports = function MoneyModelTestConfig (config) {
	return {
		name: new TextFieldTestObject(objectAssign({}, config, {fieldName: 'name'})),
		fieldA: new MoneyFieldTestObject(objectAssign({}, config, {fieldName: 'fieldA'})),
		fieldB: new MoneyFieldTestObject(objectAssign({}, config, {fieldName: 'fieldB'})),
		fieldC: new MoneyFieldTestObject(objectAssign({}, config, {fieldName: 'fieldC'})),
		fieldD: new TextFieldTestObject(objectAssign({}, config, {fieldName: 'fieldD'})),
	};
};
