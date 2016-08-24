var objectAssign = require('object-assign');
var TextField = require('../fieldTestObjects/textField');

module.exports = function TextModel (config) {
	return {
		name: new TextField(objectAssign({}, config, {fieldName: 'name'})),
		fieldA: new TextField(objectAssign({}, config, {fieldName: 'fieldA'})),
		fieldB: new TextField(objectAssign({}, config, {fieldName: 'fieldB'})),
	};
};
