var keystone = require('../../../index.js');
var Types = keystone.Field.Types;

var SelectFieldOnInitial = new keystone.List('SelectFieldOnInitial', {
	autokey: {path: 'key', from: 'name', unique: true},
	track: true
});

SelectFieldOnInitial.add({
	name: {
		type: String,
		required: true,
		index: true
	},
	type: {
		type: Types.Select,
		options: 'Pizza, Burger, Hot Dog',
		required: true,
		initial: true,
		noedit: true,
		label: "Food Type",
		index: true
	},
});

SelectFieldOnInitial.defaultColumns = 'name, type';
SelectFieldOnInitial.register();

module.exports = SelectFieldOnInitial;
