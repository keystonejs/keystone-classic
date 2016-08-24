var objectAssign = require('object-assign');
var TextField = require('../fieldTestObjects/textField');
var MoneyField = require('../fieldTestObjects/moneyField');

module.exports = function MoneyModel (config) {
	return {
		name: new TextField(objectAssign({}, config, {fieldName: 'name'})),
		fieldA: new MoneyField(objectAssign({}, config, {fieldName: 'fieldA'})),
		fieldB: new MoneyField(objectAssign({}, config, {fieldName: 'fieldB'})),
		fieldC: new MoneyField(objectAssign({}, config, {fieldName: 'fieldC'})),
		fieldD: new TextField(objectAssign({}, config, {fieldName: 'fieldD'})),
	};
};
