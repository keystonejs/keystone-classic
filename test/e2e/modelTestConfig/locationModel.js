var TextField = require('../fieldTestObjects/textField');
var LocationField = require('../fieldTestObjects/locationField');

module.exports = function LocationModel (config) {
	return {
		name: new TextField({fieldName: 'name'}),
		fieldA: new LocationField({fieldName: 'fieldA'}),
		fieldB: new LocationField({fieldName: 'fieldB'}),
	};
};
