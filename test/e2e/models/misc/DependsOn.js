var keystone = require('../../../../index.js');
var Types = keystone.Field.Types;

// Model to demonstrate issue #2929

var DependsOn = new keystone.List('DependsOn', {
	autokey: {
		path: 'key',
		from: 'name',
		unique: true,
	},
	track: true,
});

DependsOn.add({
	dependency: { type: Boolean, initial: true, default: false },
	dependent:
	{
		type: Types.Select,
		options: ['spam', 'ham'],
		initial: true,
		dependsOn: { dependency: false }
	}
});

DependsOn.register();

module.exports = DependsOn;
