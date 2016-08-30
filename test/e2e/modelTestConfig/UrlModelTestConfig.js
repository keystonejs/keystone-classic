var objectAssign = require('object-assign');
var TextFieldTestObject = require('../fieldTestObjects/TextFieldTestObject');
var UrlFieldTestObject = require('../fieldTestObjects/UrlFieldTestObject');

module.exports = function UrlModelTestConfig (config) {
	return {
		name: new TextFieldTestObject(objectAssign({}, config, {fieldName: 'name'})),
		fieldA: new UrlFieldTestObject(objectAssign({}, config, {fieldName: 'fieldA'})),
		fieldB: new UrlFieldTestObject(objectAssign({}, config, {fieldName: 'fieldB'})),
	};
};
