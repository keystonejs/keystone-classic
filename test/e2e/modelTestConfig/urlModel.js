var TextField = require('../fieldTestObjects/textField');
var UrlField = require('../fieldTestObjects/urlField');

module.exports = function UrlList(config) {
	return {
		name: new TextField({fieldName: 'name'}),
		fieldA: new UrlField({fieldName: 'fieldA'}),
		fieldB: new UrlField({fieldName: 'fieldB'}),
	};
};
