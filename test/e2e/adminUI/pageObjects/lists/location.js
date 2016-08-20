var TextType = require('../fieldTypes/text');
var LocationType = require('../fieldTypes/location');

module.exports = function LocationList(config) {
	return {
		selector: '.Form',
		sections: {
			name: new TextType({fieldName: 'name'}),
			fieldA: new LocationType({fieldName: 'fieldA'}),
			fieldB: new LocationType({fieldName: 'fieldB'}),
		},
		commands: [{
			//
			// LIST LEVEL COMMANDS
			//
		}],
	};
};
