var keystone = require('../../../../index.js');
var Types = keystone.Field.Types;

var Name = new keystone.List('Name', {
	autokey: {path: 'key', from: 'name', unique: true},
	track: true
});

Name.add({
	name: {type: Types.Name, initial: true, required: true, index: true},
	testA: {type: Types.Name, index: true},
});

Name.defaultColumns = 'name';
Name.register();

module.exports = Name;
