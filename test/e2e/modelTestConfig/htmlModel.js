var TextField = require('../fieldTestObjects/textField');
var HtmlField = require('../fieldTestObjects/htmlField');

module.exports = function HtmlModel (config) {
	return {
		name: new TextField({fieldName: 'name'}),
		fieldA: new HtmlField({fieldName: 'fieldA'}),
		fieldB: new HtmlField({fieldName: 'fieldB'}),
	};
};
