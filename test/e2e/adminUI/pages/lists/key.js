var TextType = require('../fieldTypes/text');
var KeyType = require('../fieldTypes/key');

module.exports = function KeyList(config) {
	return {
		selector: '.Form',
		sections: {
			name: new TextType({fieldName: 'name'}),
			fieldA: new KeyType({fieldName: 'fieldA'}),
			fieldB: new KeyType({fieldName: 'fieldB'}),
		},
		commands: [{
			//
			// LIST LEVEL COMMANDS
			//
		}],
	};
};
