var objectAssign = require('object-assign');
var BooleanFieldTestObject = require('../../../../fieldTestObjects/BooleanFieldTestObject');
var SelectFieldTestObject = require('../../../../fieldTestObjects/SelectFieldTestObject');

module.exports = function DependsOnList(config) {
	return {
		dependency: new BooleanFieldTestObject(objectAssign({}, config, {fieldName: 'dependency'})),
		dependent: new SelectFieldTestObject(objectAssign({}, config, {fieldName: 'dependent'})),
	};
};
