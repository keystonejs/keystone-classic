var TextField = require('../fieldTestObjects/textField');

module.exports = function TextModel (config) {
	return {
		name: new TextField({fieldName: 'name'}),
		fieldA: new TextField({fieldName: 'fieldA'}),
		fieldB: new TextField({fieldName: 'fieldB'}),
	};
};
