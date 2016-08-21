var TextField = require('../fieldTestObjects/textField');
var RelationshipField = require('../fieldTestObjects/relationshipField');

module.exports = function RelationshipModel (config) {
	return {
		name: new TextField({fieldName: 'name'}),
		fieldA: new RelationshipField({fieldName: 'fieldA'}),
		fieldB: new RelationshipField({fieldName: 'fieldB'}),
	};
};
