var TextField = require('../fieldTestObjects/textField');
var TextArrayField = require('../fieldTestObjects/textArrayField');

module.exports = function TextArrayModel (config) {
	return {
		name: new TextField({fieldName: 'name'}),
		fieldA: new TextArrayField({fieldName: 'fieldA'}),
		fieldB: new TextArrayField({fieldName: 'fieldB'}),
	};
};
