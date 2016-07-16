module.exports = {
	Field: require('../SelectField'),
	Filter: require('../SelectFilter'),
	readme: require('fs').readFileSync('./fields/types/select/Readme.md', 'utf8'),
	section: 'Miscellaneous',
	spec: {
		label: 'Select',
		path: 'select',
		ops: [
			{ label: 'Caramel', value: 'caramel' },
			{ label: 'Chocolate', value: 'chocolate' },
			{ label: 'Strawberry', value: 'strawberry' },
			{ label: 'Vanilla', value: 'vanilla' },
		],
	},
	value: 'chocolate',
};
