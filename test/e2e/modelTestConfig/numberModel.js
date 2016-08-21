var TextType = require('../fieldTestObjects/textField');
var NumberType = require('../fieldTestObjects/numberField');

module.exports = function NumberList(config) {
	return {
		name: new TextType({fieldName: 'name'}),
		fieldA: new NumberType({fieldName: 'fieldA'}),
		fieldB: new NumberType({fieldName: 'fieldB'}),
	};
};
