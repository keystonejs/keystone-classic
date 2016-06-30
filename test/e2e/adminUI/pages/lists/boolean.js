var TextType = require('../fieldTypes/text');
var BooleanType = require('../fieldTypes/boolean');

module.exports = function BooleanList(config) {
	return {
		selector: '.Form',
		sections: {
			name: new TextType({fieldName: 'name'}),
			fieldA: new BooleanType({fieldName: 'fieldA'}),
			fieldB: new BooleanType({fieldName: 'fieldB'}),
			fieldC: new BooleanType({fieldName: 'fieldC'}),
			fieldD: new TextType({fieldName: 'fieldD'}),
		},
	};
};
