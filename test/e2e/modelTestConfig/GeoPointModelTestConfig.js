var objectAssign = require('object-assign');
var TextFieldTestObject = require('../fieldTestObjects/TextFieldTestObject');
var GeoPointFieldTestObject = require('../fieldTestObjects/GeoPointFieldTestObject');

module.exports = function GeoPointModelTestConfig (config) {
	return {
		name: new TextFieldTestObject(objectAssign({}, config, {fieldName: 'name'})),
		fieldA: new GeoPointFieldTestObject(objectAssign({}, config, {fieldName: 'fieldA'})),
		fieldB: new GeoPointFieldTestObject(objectAssign({}, config, {fieldName: 'fieldB'})),
	};
};
