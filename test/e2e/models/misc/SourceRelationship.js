var keystone = require('../../../../index');
var Types = keystone.Field.Types;

var SourceRelationship = new keystone.List('SourceRelationship');

SourceRelationship.add({
	name: {
		type: String,
		initial: true,
	},
	fieldA: { 
		type: Types.Relationship, 
		ref: 'TargetRelationship'
	},
	fieldB: { 
		type: Types.Relationship, 
		ref: 'TargetRelationship',
		many: true
	},
});

SourceRelationship.register();
SourceRelationship.defaultColumns = 'name, fieldA, fieldB';

module.exports = SourceRelationship;
