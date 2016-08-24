var objectAssign = require('object-assign');
var TextField = require('../fieldTestObjects/textField');
var RelationshipField = require('../fieldTestObjects/relationshipField');

module.exports = function RelationshipModel (config) {
	return {
		name: new TextField(objectAssign({}, config, {fieldName: 'name'})),
		fieldA: new RelationshipField(objectAssign({}, config, {fieldName: 'fieldA'})),
		fieldB: new RelationshipField(objectAssign({}, config, {fieldName: 'fieldB'})),
	};
};
