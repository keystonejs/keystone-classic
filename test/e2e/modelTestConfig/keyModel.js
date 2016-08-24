var objectAssign = require('object-assign');
var TextField = require('../fieldTestObjects/textField');
var KeyField = require('../fieldTestObjects/keyField');

module.exports = function KeyModel (config) {
	return {
		name: new TextField(objectAssign({}, config, {fieldName: 'name'})),
		fieldA: new KeyField(objectAssign({}, config, {fieldName: 'fieldA'})),
		fieldB: new KeyField(objectAssign({}, config, {fieldName: 'fieldB'})),
	};
};
