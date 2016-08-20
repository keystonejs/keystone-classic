var TextType = require('../fieldTypes/text');
var CloudinaryImageMultipleType = require('../fieldTypes/cloudinaryImageMultiple');

module.exports = function CloudinaryImageMultipleList(config) {
	return {
		selector: '.Form',
		sections: {
			name: new TextType({fieldName: 'name'}),
			fieldA: new CloudinaryImageMultipleType({fieldName: 'fieldA'}),
			fieldB: new CloudinaryImageMultipleType({fieldName: 'fieldB'}),
		},
		commands: [{
			//
			// LIST LEVEL COMMANDS
			//
		}],
	};
};
