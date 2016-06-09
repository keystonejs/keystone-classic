var TextType = require('../../fieldTypes/text');
var RelationshipType = require('../../fieldTypes/relationship');

module.exports = function HiddenRelationshipList(config) {
	return {
		selector: '.Form',
		sections: {
			name: new TextType({fieldName: 'name'}),
			fieldA: new RelationshipType({fieldName: 'fieldA'}),
		},
	};
};
