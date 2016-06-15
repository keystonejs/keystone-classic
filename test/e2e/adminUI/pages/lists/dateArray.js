var TextType = require('../fieldTypes/text');
var DateArrayType = require('../fieldTypes/dateArray');

module.exports = function DateArrayList(config) {
	return {
		selector: '.Form',
		sections: {
			name: new TextType({fieldName: 'name'}),
			fieldA: new DateArrayType({fieldName: 'fieldA'}),
			fieldB: new DateArrayType({fieldName: 'fieldB'}),
		},
		commands: [{
			//
			// LIST LEVEL COMMANDS
			//
		}],
	};
};
