var keystone = require('../../../../index.js');
var Types = keystone.Field.Types;

var Bool = new keystone.List('Boolean', {
	autokey: {
		path: 'key', 
		from: 'name', 
		unique: true,
	},
	track: true,
});

Bool.add({
	name: {
		type: String, 
		initial: true, 
		required: true, 
		index: true,
	},
	fieldA: {
		type: Boolean, 
		initial: true, 
		index: true,
	},
	fieldB: {
		type: Boolean, 
		index: true,
	},
	fieldC:
	{
		type: Types.Boolean,
		hidden: true,
		default: true
	},
	fieldD:
	{
		type: String,
		initial: true,
		dependsOn: { fieldC: true }
	},
	// TODO: we should add a test for booleans with a default value of `true`
	// that are visible in the Admin UI (see #4927)
});

Bool.defaultColumns = 'name, fieldA, fieldB';
Bool.register();

module.exports = Bool;
