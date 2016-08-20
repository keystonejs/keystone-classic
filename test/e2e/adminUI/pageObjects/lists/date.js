var TextType = require('../fieldTypes/text');
var DateType = require('../fieldTypes/date');

module.exports = function DateList(config) {
	return {
		selector: '.Form',
		sections: {
			name: new TextType({fieldName: 'name'}),
			fieldA: new DateType({fieldName: 'fieldA'}),
			fieldB: new DateType({fieldName: 'fieldB'}),
		},
		commands: [{
			//
			// LIST LEVEL COMMANDS
			//
		}],
	};
};
