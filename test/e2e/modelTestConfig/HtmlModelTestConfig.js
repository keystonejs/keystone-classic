var objectAssign = require('object-assign');
var TextFieldTestObject = require('../fieldTestObjects/TextFieldTestObject');
var HtmlFieldTestObject = require('../fieldTestObjects/HtmlFieldTestObject');

module.exports = function HtmlModelTestConfig (config) {
	return {
		name: new TextFieldTestObject(objectAssign({}, config, {fieldName: 'name'})),
		fieldA: new HtmlFieldTestObject(objectAssign({}, config, {fieldName: 'fieldA'})),
		fieldB: new HtmlFieldTestObject(objectAssign({}, config, {fieldName: 'fieldB'})),
	};
};
