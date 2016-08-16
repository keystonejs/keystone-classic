var keystone = require('../../../../index');
var Types = keystone.Field.Types;

var NamelessRelationship = new keystone.List('NamelessRelationship');

NamelessRelationship.add({
	fieldA: { 
		type: Types.Relationship, 
		ref: 'TargetRelationship',
		hidden: true,
	},
	fieldB: { 
		type: Types.Relationship, 
		ref: 'TargetRelationship',
		many: true,
	},
});

NamelessRelationship.register();
NamelessRelationship.defaultColumns = 'fieldA, fieldB';

module.exports = NamelessRelationship;
