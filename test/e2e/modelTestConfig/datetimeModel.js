var TextField = require('../fieldTestObjects/textField');
var DatetimeField = require('../fieldTestObjects/datetimeField');

module.exports = function DatetimeModel (config) {
	return {
		name: new TextField({fieldName: 'name'}),
		fieldA: new DatetimeField({fieldName: 'fieldA'}),
		fieldB: new DatetimeField({fieldName: 'fieldB'}),
	};
};
