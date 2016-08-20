var TextType = require('../fieldTypes/text');
var TextareaType = require('../fieldTypes/textarea');

module.exports = function TextareaList(config) {
	return {
		selector: '.Form',
		sections: {
			name: new TextType({fieldName: 'name'}),
			fieldA: new TextareaType({fieldName: 'fieldA'}),
			fieldB: new TextareaType({fieldName: 'fieldB'}),
		},
		commands: [{
			//
			// LIST LEVEL COMMANDS
			//
		}],
	};
};
