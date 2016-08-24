var objectAssign = require('object-assign');
var TextField = require('../fieldTestObjects/textField');
var UrlField = require('../fieldTestObjects/urlField');

module.exports = function UrlModel (config) {
	return {
		name: new TextField(objectAssign({}, config, {fieldName: 'name'})),
		fieldA: new UrlField(objectAssign({}, config, {fieldName: 'fieldA'})),
		fieldB: new UrlField(objectAssign({}, config, {fieldName: 'fieldB'})),
	};
};
