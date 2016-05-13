var keystone = require('../../../../index.js');
var Types = keystone.Field.Types;

var Relationship = new keystone.List('Relationship', {
  autokey: {
    path: 'key', 
    from: 'name', 
    unique: true,
  },
  track: true,
});

Relationship.add({
  name: {
    type: String, 
    initial: true, 
    required: true, 
    index: true,
  },
  parent: {
    type: Types.Relationship,
    ref: 'Relationship',
    initial: true, 
  }
});

Relationship.relationship({
  path: 'childs',
  ref: 'Relationship',
  refPath: 'parent'
});

Relationship.defaultColumns = 'name, parent';
Relationship.register();

module.exports = Relationship;
