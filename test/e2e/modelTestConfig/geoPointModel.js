var objectAssign = require('object-assign');
var TextField = require('../fieldTestObjects/textField');
var GeoPointField = require('../fieldTestObjects/geoPointField');

module.exports = function GeoPointModel (config) {
	return {
		name: new TextField(objectAssign({}, config, {fieldName: 'name'})),
		fieldA: new GeoPointField(objectAssign({}, config, {fieldName: 'fieldA'})),
		fieldB: new GeoPointField(objectAssign({}, config, {fieldName: 'fieldB'})),
	};
};
