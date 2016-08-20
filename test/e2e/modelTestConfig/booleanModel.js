var TextField = require('../fieldTestObjects/textField');
var BooleanField = require('../fieldTestObjects/booleanField');

module.exports = function ModelTestConfig (config) {
	return {
			name: new TextField({fieldName: 'name'}),
			fieldA: new BooleanField({fieldName: 'fieldA'}),
			fieldB: new BooleanField({fieldName: 'fieldB'}),
			fieldC: new BooleanField({fieldName: 'fieldC'}),
			fieldD: new TextField({fieldName: 'fieldD'}),
	};
};
