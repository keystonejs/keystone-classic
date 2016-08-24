var objectAssign = require('object-assign');
var TextField = require('../fieldTestObjects/textField');
var DateArrayField = require('../fieldTestObjects/dateArrayField');

module.exports = function DateModel (config) {
	return {
		name: new TextField(objectAssign({}, config, {fieldName: 'name'})),
		fieldA: new DateArrayField(objectAssign({}, config, {fieldName: 'fieldA'})),
		fieldB: new DateArrayField(objectAssign({}, config, {fieldName: 'fieldB'})),
	};
};
