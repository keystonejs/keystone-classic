var TextType = require('../fieldTypes/text');
var EmailType = require('../fieldTypes/email');

module.exports = function EmailList(config) {
	return {
		selector: '.Form',
		sections: {
			name: new TextType({fieldName: 'name'}),
			fieldA: new EmailType({fieldName: 'fieldA'}),
			fieldB: new EmailType({fieldName: 'fieldB'}),
		},
		commands: [{
			//
			// LIST LEVEL COMMANDS
			//
		}],
	};
};
