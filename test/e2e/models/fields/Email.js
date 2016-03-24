var keystone = require('../../../../index.js');
var Types = keystone.Field.Types;

var Email = new keystone.List('Email', {
	autokey: {path: 'key', from: 'name', unique: true},
	track: true
});

Email.add({
	name: {type: Types.Email, initial: true, required: true, index: true},
	testA: {type: Types.Email, index: true},
});

Email.defaultColumns = 'name';
Email.register();

module.exports = Email;
