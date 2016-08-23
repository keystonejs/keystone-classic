var TextField = require('../fieldTestObjects/textField');
var MoneyField = require('../fieldTestObjects/moneyField');

module.exports = function MoneyModel (config) {
	return {
		name: new TextField({fieldName: 'name'}),
		fieldA: new MoneyField({fieldName: 'fieldA'}),
		fieldB: new MoneyField({fieldName: 'fieldB'}),
		fieldC: new MoneyField({fieldName: 'fieldC'}),
		fieldD: new TextField({fieldName: 'fieldD'}),
	};
};
