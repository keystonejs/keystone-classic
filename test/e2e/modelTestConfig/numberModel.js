var TextType = require('../fieldTestObjects/textField');
var NumberType = require('../fieldTestObjects/numberField');

module.exports = function NumberModel (config) {
	return {
		name: new TextType({fieldName: 'name'}),
		fieldA: new NumberType({fieldName: 'fieldA'}),
		fieldB: new NumberType({fieldName: 'fieldB'}),
	};
};
