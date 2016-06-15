var TextType = require('../fieldTypes/text');
var NumberArrayType = require('../fieldTypes/numberArray');

module.exports = function NumberArrayList(config) {
	return {
		selector: '.Form',
		sections: {
			name: new TextType({fieldName: 'name'}),
			fieldA: new NumberArrayType({fieldName: 'fieldA'}),
			fieldB: new NumberArrayType({fieldName: 'fieldB'}),
		},
		commands: [{
			//
			// LIST LEVEL COMMANDS
			//
		}],
	};
};
