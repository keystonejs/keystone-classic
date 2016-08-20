var TextType = require('../fieldTypes/text');
var DatetimeType = require('../fieldTypes/datetime');

module.exports = function DatetimeList(config) {
	return {
		selector: '.Form',
		sections: {
			name: new TextType({fieldName: 'name'}),
			fieldA: new DatetimeType({fieldName: 'fieldA'}),
			fieldB: new DatetimeType({fieldName: 'fieldB'}),
		},
		commands: [{
			//
			// LIST LEVEL COMMANDS
			//
		}],
	};
};
