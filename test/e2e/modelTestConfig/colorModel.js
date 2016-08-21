var TextField = require('../fieldTestObjects/textField');
var ColorField = require('../fieldTestObjects/colorField');

module.exports = function ColorModel (config) {
	return {
		name: new TextField({fieldName: 'name'}),
		fieldA: new ColorField({fieldName: 'fieldA'}),
		fieldB: new ColorField({fieldName: 'fieldB'}),
	};
};
