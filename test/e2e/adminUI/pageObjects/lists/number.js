var TextType = require('../fieldTypes/text');
var NumberType = require('../fieldTypes/number');

module.exports = function NumberList(config) {
	return {
		selector: '.Form',
		sections: {
			name: new TextType({fieldName: 'name'}),
			fieldA: new NumberType({fieldName: 'fieldA'}),
			fieldB: new NumberType({fieldName: 'fieldB'}),
		},
		commands: [{
			//
			// LIST LEVEL COMMANDS
			//
		}],
	};
};
