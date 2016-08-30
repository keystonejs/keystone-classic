var objectAssign = require('object-assign');
var RelationshipFieldTestObject = require('../../../../fieldTestObjects/RelationshipFieldTestObject');

module.exports = function InlineRelationshipList(config) {
	return {
		fieldA: new RelationshipFieldTestObject(objectAssign({}, config, {fieldName: 'fieldA'})),
	};
};
