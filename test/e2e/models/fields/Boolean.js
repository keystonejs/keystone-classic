var keystone = require('../../../../index.js');
var Types = keystone.Field.Types;

var Bool = new keystone.List('Boolean', {
	autokey: {path: 'key', from: 'name', unique: true},
	track: true
});

Bool.add({
	name: {type: Boolean, initial: true, index: true},
	testA: {type: Boolean}
});

Bool.defaultColumns = 'name';
Bool.register();

module.exports = Bool;
