var objectAssign = require('object-assign');
var TextField = require('../fieldTestObjects/textField');
var LocationField = require('../fieldTestObjects/locationField');

module.exports = function LocationModel (config) {
	return {
		name: new TextField(objectAssign({}, config, {fieldName: 'name'})),
		fieldA: new LocationField(objectAssign({}, config, {fieldName: 'fieldA'})),
		fieldB: new LocationField(objectAssign({}, config, {fieldName: 'fieldB'})),
	};
};
