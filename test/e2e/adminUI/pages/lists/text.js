var TextType = require('../fieldTypes/text');

module.exports = function NameList(config) {
	return {
		selector: '.Form',
		sections: {
			name: new TextType({fieldName: 'name'}),
			fieldA: new TextType({fieldName: 'fieldA'}),
			fieldB: new TextType({fieldName: 'fieldB'}),
		},
		commands: [{
			//
			// LIST LEVEL COMMANDS
			//
		}],
	};
};
