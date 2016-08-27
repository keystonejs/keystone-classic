var objectAssign = require('object-assign');
var TextFieldTestObject = require('../../../../fieldTestObjects/TextFieldTestObject');
var RelationshipFieldTestObject = require('../../../../fieldTestObjects/RelationshipFieldTestObject');

module.exports = function HiddenRelationshipList(config) {
	return {
		name: new TextFieldTestObject(objectAssign({}, config, {fieldName: 'name'})),
		fieldA: new RelationshipFieldTestObject(objectAssign({}, config, {fieldName: 'fieldA'})),
	};
};
