var TextType = require('../fieldTypes/text');
var LocalFileType = require('../fieldTypes/localFile');

module.exports = function LocalFileList(config) {
	return {
		selector: '.Form',
		sections: {
			name: new TextType({fieldName: 'name'}),
			fieldA: new LocalFileType({fieldName: 'fieldA'}),
			fieldB: new LocalFileType({fieldName: 'fieldB'}),
		},
		commands: [{
			//
			// LIST LEVEL COMMANDS
			//
		}],
	};
};
