var TextType = require('../fieldTypes/text');
var LocalFileMultipleType = require('../fieldTypes/localFileMultiple');

module.exports = function LocalFileMultipleList(config) {
	return {
		selector: '.Form',
		sections: {
			name: new TextType({fieldName: 'name'}),
			fieldA: new LocalFileMultipleType({fieldName: 'fieldA'}),
			fieldB: new LocalFileMultipleType({fieldName: 'fieldB'}),
		},
		commands: [{
			//
			// LIST LEVEL COMMANDS
			//
		}],
	};
};
