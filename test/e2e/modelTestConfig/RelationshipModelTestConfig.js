var objectAssign = require('object-assign');
var fieldTestObjectsPath = require('keystone-nightwatch-e2e').fieldTestObjectsPath;
var path = require('path');
var TextFieldTestObject = require(path.resolve(fieldTestObjectsPath, 'TextFieldTestObject'));
var RelationshipFieldTestObject = require(path.resolve(fieldTestObjectsPath, 'RelationshipFieldTestObject'));

module.exports = function RelationshipModelTestConfig (config) {
	return {
		name: new TextFieldTestObject(objectAssign({}, config, {fieldName: 'name'})),
		fieldA: new RelationshipFieldTestObject(objectAssign({}, config, {fieldName: 'fieldA'})),
		fieldB: new RelationshipFieldTestObject(objectAssign({}, config, {fieldName: 'fieldB'})),
	};
};
