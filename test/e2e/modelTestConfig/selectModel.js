var objectAssign = require('object-assign');
var SelectField = require('../fieldTestObjects/selectField');
var TextField = require('../fieldTestObjects/textField');

module.exports = function SelectModel(config) {
	return {
		name: new TextField(objectAssign({}, config, {fieldName: 'name'})),
		fieldA: new SelectField(objectAssign({}, config, {fieldName: 'fieldA'})),
		fieldB: new SelectField(objectAssign({}, config, {fieldName: 'fieldB'})),
	};
};
