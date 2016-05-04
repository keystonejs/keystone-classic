var TextType = require('../fieldTypes/text');
var MarkdownType = require('../fieldTypes/markdown');

module.exports = function MarkdownList(config) {
	return {
		selector: '.Form',
		sections: {
			name: new TextType({fieldName: 'name'}),
			fieldA: new MarkdownType({fieldName: 'fieldA'}),
			fieldB: new MarkdownType({fieldName: 'fieldB'}),
		},
		commands: [{
			//
			// LIST LEVEL COMMANDS
			//
		}],
	};
};
