var TextField = require('../fieldTestObjects/textField');
var DateArrayField = require('../fieldTestObjects/dateArrayField');

module.exports = function DateModel (config) {
	return {
		name: new TextField({fieldName: 'name'}),
		fieldA: new DateArrayField({fieldName: 'fieldA'}),
		fieldB: new DateArrayField({fieldName: 'fieldB'}),
	};
};
