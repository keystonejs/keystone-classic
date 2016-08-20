var TextType = require('../fieldTypes/text');
var MoneyType = require('../fieldTypes/money');

module.exports = function MoneyList(config) {
	return {
		selector: '.Form',
		sections: {
			name: new TextType({fieldName: 'name'}),
			fieldA: new MoneyType({fieldName: 'fieldA'}),
			fieldB: new MoneyType({fieldName: 'fieldB'}),
		},
		commands: [{
			//
			// LIST LEVEL COMMANDS
			//
		}],
	};
};
