var TextType = require('../fieldTypes/text');
var RelationshipType = require('../fieldTypes/relationship');

module.exports = function RelationshipList(config) {
	return {
		selector: '.Form',
		sections: {
			name: new TextType({fieldName: 'name'}),
			fieldA: new RelationshipType({fieldName: 'fieldA'}),
			fieldB: new RelationshipType({fieldName: 'fieldB'}),
		},
		commands: [{
			//
			// LIST LEVEL COMMANDS
			//
		}],
	};
};
