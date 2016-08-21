var CodeField = require('../fieldTestObjects/codeField');
var TextField = require('../fieldTestObjects/textField');

module.exports = function CodeModel (config) {
	return {
		name: new TextField({fieldName: 'name'}),
		fieldA: new CodeField({fieldName: 'fieldA'}),
		fieldB: new CodeField({fieldName: 'fieldB'}),
	};
};
