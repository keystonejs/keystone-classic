var TextType = require('../fieldTypes/text');
var LocalFilexType = require('../fieldTypes/localFilex');

module.exports = function LocalFilexList(config) {
	return {
		selector: '.Form',
		sections: {
			name: new TextType({fieldName: 'name'}),
			fieldA: new LocalFilexType({fieldName: 'fieldA'}),
			fieldB: new LocalFilexType({fieldName: 'fieldB'}),
		},
		commands: [{
			//
			// LIST LEVEL COMMANDS
			//
		}],
	};
};
