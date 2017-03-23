var keystone = require('../../../../index.js');
var Types = keystone.Field.Types;

// Model to demonstrate issue #2929

var DependencyA = new keystone.List('DependencyA', {
	autokey: {
		path: 'key',
		from: 'name',
		unique: true,
	},
	track: true,
});

DependencyA.add({
	dependency: { type: Boolean, initial: true, default: false },
});

DependencyA.register();

module.exports = DependencyA;
