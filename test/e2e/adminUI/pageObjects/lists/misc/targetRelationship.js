var TextType = require('../../fieldTypes/text');

module.exports = function TargetRelationshipList(config) {
	return {
		selector: '.Form',
		sections: {
			name: new TextType({fieldName: 'name'}),
		},
	};
};
