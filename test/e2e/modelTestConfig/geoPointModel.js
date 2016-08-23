var TextField = require('../fieldTestObjects/textField');
var GeoPointField = require('../fieldTestObjects/geoPointField');

module.exports = function GeoPointModel (config) {
	return {
		name: new TextField({fieldName: 'name'}),
		fieldA: new GeoPointField({fieldName: 'fieldA'}),
		fieldB: new GeoPointField({fieldName: 'fieldB'}),
	};
};
