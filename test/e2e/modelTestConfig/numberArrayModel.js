var objectAssign = require('object-assign');
var TextField = require('../fieldTestObjects/textField');
var NumberArrayField = require('../fieldTestObjects/numberArrayField');

module.exports = function NumberArrayModel (config) {
	return {
		name: new TextField(objectAssign({}, config, {fieldName: 'name'})),
		fieldA: new NumberArrayField(objectAssign({}, config, {fieldName: 'fieldA'})),
		fieldB: new NumberArrayField(objectAssign({}, config, {fieldName: 'fieldB'})),
	};
};
