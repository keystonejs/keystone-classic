var TextType = require('../fieldTypes/text');
var ColorType = require('../fieldTypes/color');

module.exports = function ColorList(config) {
	return {
		selector: '.Form',
		sections: {
			name: new TextType({fieldName: 'name'}),
			fieldA: new ColorType({fieldName: 'fieldA'}),
			fieldB: new ColorType({fieldName: 'fieldB'}),
		},
		commands: [{
			//
			// LIST LEVEL COMMANDS
			//
		}],
	};
};
