var objectAssign = require('object-assign');
var TextField = require('../fieldTestObjects/textField');
var DatetimeField = require('../fieldTestObjects/datetimeField');

module.exports = function DatetimeModel (config) {
	return {
		name: new TextField(objectAssign({}, config, {fieldName: 'name'})),
		fieldA: new DatetimeField(objectAssign({}, config, {fieldName: 'fieldA'})),
		fieldB: new DatetimeField(objectAssign({}, config, {fieldName: 'fieldB'})),
	};
};
