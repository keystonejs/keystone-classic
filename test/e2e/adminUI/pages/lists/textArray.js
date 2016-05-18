var TextType = require('../fieldTypes/text');
var TextArrayType = require('../fieldTypes/textArray');

module.exports = function TextArrayList(config) {
	return {
		selector: '.Form',
		sections: {
			name: new TextType({fieldName: 'name'}),
			fieldA: new TextArrayType({fieldName: 'fieldA'}),
			fieldB: new TextArrayType({fieldName: 'fieldB'}),
		},
		commands: [{
			//
			// LIST LEVEL COMMANDS
			//
		}],
	};
};
