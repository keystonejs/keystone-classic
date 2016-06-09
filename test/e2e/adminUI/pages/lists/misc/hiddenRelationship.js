var RelationshipType = require('../../fieldTypes/relationship');

module.exports = function HiddenRelationshipList(config) {
	return {
		selector: '.Form',
		sections: {
			fieldA: new RelationshipType({fieldName: 'fieldA'}),
		},
	};
};
