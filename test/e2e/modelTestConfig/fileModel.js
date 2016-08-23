var TextField = require('../fieldTestObjects/textField');
var FileField = require('../fieldTestObjects/fileField');

module.exports = function FileModel (config) {
	return {
		name: new TextField({fieldName: 'name'}),
		fieldA: new FileField({fieldName: 'fieldA'}),
		fieldB: new FileField({fieldName: 'fieldB'}),
	};
};
