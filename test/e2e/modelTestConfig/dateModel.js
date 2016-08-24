var objectAssign = require('object-assign');
var TextField = require('../fieldTestObjects/textField');
var DateField = require('../fieldTestObjects/dateField');

module.exports = function DateModel (config) {
	return {
		name: new TextField(objectAssign({}, config, {fieldName: 'name'})),
		fieldA: new DateField(objectAssign({}, config, {fieldName: 'fieldA'})),
		fieldB: new DateField(objectAssign({}, config, {fieldName: 'fieldB'})),
	};
};
