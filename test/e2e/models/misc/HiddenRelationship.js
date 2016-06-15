var keystone = require('../../../../index.js');
var Types = keystone.Field.Types;

var HiddenRelationship = new keystone.List('HiddenRelationship');

HiddenRelationship.add({
	fieldA: { type: Types.Relationship, ref: 'User', initial: true, hidden: true },
});

HiddenRelationship.register();
module.exports = HiddenRelationship;
