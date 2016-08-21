var TextField = require('../fieldTestObjects/textField');
var NumberField = require('../fieldTestObjects/numberField');

module.exports = function NumberModel (config) {
	return {
		name: new TextField({fieldName: 'name'}),
		fieldA: new NumberField({fieldName: 'fieldA'}),
		fieldB: new NumberField({fieldName: 'fieldB'}),
	};
};
