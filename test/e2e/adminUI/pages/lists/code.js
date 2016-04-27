var CodeType = require('../fieldTypes/code');
var TextType = require('../fieldTypes/text');

module.exports = function NameList(config) {
	return {
		selector: '.Form',
		sections: {
			name: new TextType({fieldName: 'name'}),
			fieldA: new CodeType({fieldName: 'fieldA'}),
			fieldB: new CodeType({fieldName: 'fieldA'}),
		},
		commands: [{
			//
			// LIST LEVEL COMMANDS
			//
		}],
	};
};
