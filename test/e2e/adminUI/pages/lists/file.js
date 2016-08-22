var TextType = require('../fieldTypes/text');
var FileType = require('../fieldTypes/file');

module.exports = function FileList(config) {
	return {
		selector: '.Form',
		sections: {
			name: new TextType({fieldName: 'name'}),
			fieldA: new FileType({fieldName: 'fieldA'}),
			fieldB: new FileType({fieldName: 'fieldB'}),
		},
		commands: [{
			//
			// LIST LEVEL COMMANDS
			//
		}],
	};
};
