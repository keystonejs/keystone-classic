var NameType = require('../fieldTypes/name');
var TextType = require('../fieldTypes/text');

module.exports = function NameList(config) {
	return {
		selector: '.Form',
		sections: {
			name: new TextType({fieldName: 'name'}),
			fieldA: new NameType({fieldName: 'fieldA'}),
			fieldB: new NameType({fieldName: 'fieldB'}),
		},
		commands: [{
			//
			// LIST LEVEL COMMANDS
			//
		}],
	};
};
