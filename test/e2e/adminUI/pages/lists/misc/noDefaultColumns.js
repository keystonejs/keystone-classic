var TextType = require('../../fieldTypes/text');

module.exports = function NoDefaultColumnsList(config) {
	return {
		selector: '.Form',
		sections: {
			fieldA: new TextType({fieldName: 'fieldA'}),
			fieldB: new TextType({fieldName: 'fieldB'}),
		},
	};
};
