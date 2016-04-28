var SelectType = require('../fieldTypes/select');
var TextType = require('../fieldTypes/text');

module.exports = function SelectList(config) {
	return {
		selector: '.Form',
		sections: {
			name: new TextType({fieldName: 'name'}),
			fieldA: new SelectType({fieldName: 'fieldA'}),
			fieldB: new SelectType({fieldName: 'fieldA'}),
		},
		commands: [{
			//
			// LIST LEVEL COMMANDS
			//
		}],
	};
};
