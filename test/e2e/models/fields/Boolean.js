var keystone = require('../../../../index.js');
var Types = keystone.Field.Types;

var Bool = new keystone.List('Boolean', {
	autokey: {path: 'key', from: 'name', unique: true},
	track: true
});

Bool.add({
	name: {type: String, initial: true, required: true, index: true},
	testA: {type: Boolean, initial: true, index: true}
});

Bool.defaultColumns = 'name, testA';
Bool.register();

module.exports = Bool;
