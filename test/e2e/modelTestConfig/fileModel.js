var objectAssign = require('object-assign');
var TextField = require('../fieldTestObjects/textField');
var FileField = require('../fieldTestObjects/fileField');

module.exports = function FileModel (config) {
	return {
		name: new TextField(objectAssign({}, config, {fieldName: 'name'})),
		fieldA: new FileField(objectAssign({}, config, {fieldName: 'fieldA'})),
		fieldB: new FileField(objectAssign({}, config, {fieldName: 'fieldB'})),
	};
};
