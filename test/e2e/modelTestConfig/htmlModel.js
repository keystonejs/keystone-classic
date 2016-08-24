var objectAssign = require('object-assign');
var TextField = require('../fieldTestObjects/textField');
var HtmlField = require('../fieldTestObjects/htmlField');

module.exports = function HtmlModel (config) {
	return {
		name: new TextField(objectAssign({}, config, {fieldName: 'name'})),
		fieldA: new HtmlField(objectAssign({}, config, {fieldName: 'fieldA'})),
		fieldB: new HtmlField(objectAssign({}, config, {fieldName: 'fieldB'})),
	};
};
