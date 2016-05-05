var TextType = require('../fieldTypes/text');
var HtmlType = require('../fieldTypes/html');

module.exports = function HtmlList(config) {
	return {
		selector: '.Form',
		sections: {
			name: new TextType({fieldName: 'name'}),
			fieldA: new HtmlType({fieldName: 'fieldA'}),
			fieldB: new HtmlType({fieldName: 'fieldB'}),
		},
		commands: [{
			//
			// LIST LEVEL COMMANDS
			//
		}],
	};
};
