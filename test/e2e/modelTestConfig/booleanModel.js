var objectAssign = require('object-assign');
var TextField = require('../fieldTestObjects/textField');
var BooleanField = require('../fieldTestObjects/booleanField');

module.exports = function BooleanModel (config) {
	return {
		name: new TextField(objectAssign({}, config, {fieldName: 'name'})),
		fieldA: new BooleanField(objectAssign({}, config, {fieldName: 'fieldA'})),
		fieldB: new BooleanField(objectAssign({}, config, {fieldName: 'fieldB'})),
		fieldC: new BooleanField(objectAssign({}, config, {fieldName: 'fieldC'})),
		fieldD: new TextField(objectAssign({}, config, {fieldName: 'fieldD'})),
	};
};
