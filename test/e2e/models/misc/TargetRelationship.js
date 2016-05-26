var keystone = require('../../../../index');
var Types = keystone.Field.Types;

var TargetRelationship = new keystone.List('TargetRelationship');

TargetRelationship.add({
	name: { 
		type: String,
		initial: true,
	},
});

TargetRelationship.relationship({
	ref: 'SourceRelationship',
	refPath: 'fieldA',
	path: 'sourceFieldA'
});

TargetRelationship.register();
TargetRelationship.defaultColumns = 'name';

module.exports = TargetRelationship;
