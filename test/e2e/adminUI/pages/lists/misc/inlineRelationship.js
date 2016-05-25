var RelationshipType = require('../../fieldTypes/relationship');

module.exports = function InlineRelationshipList(config) {
	return {
		selector: '.Form',
		sections: {
			fieldA: new RelationshipType({fieldName: 'fieldA'}),
		},
	};
};
