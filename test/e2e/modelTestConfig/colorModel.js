var objectAssign = require('object-assign');
var TextField = require('../fieldTestObjects/textField');
var ColorField = require('../fieldTestObjects/colorField');

module.exports = function ColorModel (config) {
	return {
		name: new TextField(objectAssign({}, config, {fieldName: 'name'})),
		fieldA: new ColorField(objectAssign({}, config, {fieldName: 'fieldA'})),
		fieldB: new ColorField(objectAssign({}, config, {fieldName: 'fieldB'})),
	};
};
