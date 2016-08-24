var objectAssign = require('object-assign');
var TextField = require('../fieldTestObjects/textField');
var TextArrayField = require('../fieldTestObjects/textArrayField');

module.exports = function TextArrayModel (config) {
	return {
		name: new TextField(objectAssign({}, config, {fieldName: 'name'})),
		fieldA: new TextArrayField(objectAssign({}, config, {fieldName: 'fieldA'})),
		fieldB: new TextArrayField(objectAssign({}, config, {fieldName: 'fieldB'})),
	};
};
