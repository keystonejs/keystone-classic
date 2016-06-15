var BooleanType = require('../../fieldTypes/boolean');
var TextType = require('../../fieldTypes/text');

module.exports = function HiddenRelationshipList(config) {
	return {
		selector: '.Form',
		sections: {
			fieldA: new BooleanType({fieldName: 'fieldA'}),
			fieldB: new TextType({fieldName: 'fieldB'}),
		},
	};
};
