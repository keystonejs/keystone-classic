var keystone = require('../../../../index.js');
var Types = keystone.Field.Types;

var ManyRelationship = new keystone.List('ManyRelationship');

ManyRelationship.add({
	name: { type: String, initial: true, index: true },
	fieldA: { type: Types.Relationship, ref: 'Text', initial: true, many: true },
});

ManyRelationship.register();
module.exports = ManyRelationship;
