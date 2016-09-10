var keystone = require('../../../../index.js');
var Types = keystone.Field.Types;

var InlineRelationship = new keystone.List('InlineRelationship');

InlineRelationship.add({
	fieldA: { type: Types.Relationship, ref: 'User', createInline: true },
});

InlineRelationship.register();
module.exports = InlineRelationship;
