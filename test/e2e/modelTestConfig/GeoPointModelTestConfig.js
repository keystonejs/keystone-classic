var objectAssign = require('object-assign');
var fieldTestObjectsPath = require('keystone-nightwatch-e2e').fieldTestObjectsPath;
var path = require('path');
var TextFieldTestObject = require(path.resolve(fieldTestObjectsPath, 'TextFieldTestObject'));
var GeoPointFieldTestObject = require(path.resolve(fieldTestObjectsPath, 'GeoPointFieldTestObject'));

module.exports = function GeoPointModelTestConfig (config) {
	return {
		name: new TextFieldTestObject(objectAssign({}, config, {fieldName: 'name'})),
		fieldA: new GeoPointFieldTestObject(objectAssign({}, config, {fieldName: 'fieldA'})),
		fieldB: new GeoPointFieldTestObject(objectAssign({}, config, {fieldName: 'fieldB'})),
	};
};
