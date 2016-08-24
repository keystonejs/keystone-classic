var objectAssign = require('object-assign');
var CodeField = require('../fieldTestObjects/codeField');
var TextField = require('../fieldTestObjects/textField');

module.exports = function CodeModel (config) {
	return {
		name: new TextField(objectAssign({}, config, {fieldName: 'name'})),
		fieldA: new CodeField(objectAssign({}, config, {fieldName: 'fieldA'})),
		fieldB: new CodeField(objectAssign({}, config, {fieldName: 'fieldB'})),
	};
};
