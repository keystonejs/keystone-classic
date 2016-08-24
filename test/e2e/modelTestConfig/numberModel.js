var objectAssign = require('object-assign');
var TextField = require('../fieldTestObjects/textField');
var NumberField = require('../fieldTestObjects/numberField');

module.exports = function NumberModel (config) {
	return {
		name: new TextField(objectAssign({}, config, {fieldName: 'name'})),
		fieldA: new NumberField(objectAssign({}, config, {fieldName: 'fieldA'})),
		fieldB: new NumberField(objectAssign({}, config, {fieldName: 'fieldB'})),
	};
};
