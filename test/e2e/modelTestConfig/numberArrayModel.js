var TextField = require('../fieldTestObjects/textField');
var NumberArrayField = require('../fieldTestObjects/numberArrayField');

module.exports = function NumberArrayModel (config) {
	return {
		name: new TextField({fieldName: 'name'}),
		fieldA: new NumberArrayField({fieldName: 'fieldA'}),
		fieldB: new NumberArrayField({fieldName: 'fieldB'}),
	};
};
