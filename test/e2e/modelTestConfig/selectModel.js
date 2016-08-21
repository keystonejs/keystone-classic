var SelectField = require('../fieldTestObjects/selectField');
var TextField = require('../fieldTestObjects/textField');

module.exports = function SelectModel(config) {
	return {
		name: new TextField({fieldName: 'name'}),
		fieldA: new SelectField({fieldName: 'fieldA'}),
		fieldB: new SelectField({fieldName: 'fieldB'}),
	};
};
