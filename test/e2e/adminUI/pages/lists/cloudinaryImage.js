var TextType = require('../fieldTypes/text');
var CloudinaryImageType = require('../fieldTypes/cloudinaryImage');

module.exports = function CloudinaryImageList(config) {
	return {
		selector: '.Form',
		sections: {
			name: new TextType({fieldName: 'name'}),
			fieldA: new CloudinaryImageType({fieldName: 'fieldA'}),
			fieldB: new CloudinaryImageType({fieldName: 'fieldB'}),
		},
		commands: [{
			//
			// LIST LEVEL COMMANDS
			//
		}],
	};
};
