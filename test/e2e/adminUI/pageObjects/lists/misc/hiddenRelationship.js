var objectAssign = require('object-assign');
var RelationshipFieldTestObject = require('../../../../fieldTestObjects/RelationshipFieldTestObject');

module.exports = function HiddenRelationshipList(config) {
	return {
		fieldA: new RelationshipFieldTestObject(objectAssign({}, config, {fieldName: 'fieldA'})),
	};
};
