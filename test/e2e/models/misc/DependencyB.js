var keystone = require('../../../../index.js');
var Types = keystone.Field.Types;

// Model to demonstrate issue #2929

var DependencyB = new keystone.List('DependencyB', {
	autokey: {
		path: 'key',
		from: 'name',
		unique: true,
	},
	track: true,
});

DependencyB.add({
	dependency: { type: Boolean, initial: true, default: false },
	dependent:
	{
		type: Types.Select,
		options: ['spam', 'ham'],
		initial: true,
		dependsOn: { dependency: false },
	},
});

DependencyB.register();

module.exports = DependencyB;
