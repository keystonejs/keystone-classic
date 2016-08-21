var TextField = require('../fieldTestObjects/textField');
var DateField = require('../fieldTestObjects/dateField');

module.exports = function DateModel (config) {
	return {
		name: new TextField({fieldName: 'name'}),
		fieldA: new DateField({fieldName: 'fieldA'}),
		fieldB: new DateField({fieldName: 'fieldB'}),
	};
};
