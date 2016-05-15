var TextType = require('../fieldTypes/text');
var CloudinaryImagexType = require('../fieldTypes/cloudinaryImagex');

module.exports = function CloudinaryImagexList(config) {
	return {
		selector: '.Form',
		sections: {
			name: new TextType({fieldName: 'name'}),
			fieldA: new CloudinaryImagexType({fieldName: 'fieldA'}),
			fieldB: new CloudinaryImagexType({fieldName: 'fieldB'}),
		},
		commands: [{
			//
			// LIST LEVEL COMMANDS
			//
		}],
	};
};
