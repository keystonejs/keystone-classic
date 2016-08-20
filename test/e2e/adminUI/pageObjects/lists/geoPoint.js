var TextType = require('../fieldTypes/text');
var GeoPointType = require('../fieldTypes/geoPoint');

module.exports = function GeoPointList(config) {
	return {
		selector: '.Form',
		sections: {
			name: new TextType({fieldName: 'name'}),
			fieldA: new GeoPointType({fieldName: 'fieldA'}),
			fieldB: new GeoPointType({fieldName: 'fieldB'}),
		},
		commands: [{
			//
			// LIST LEVEL COMMANDS
			//
		}],
	};
};
