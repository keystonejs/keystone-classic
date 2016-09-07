module.exports = {
	Field: require('../SelectField'),
	Filter: require('../SelectFilter'),
	readme: require('../Readme.md'),
	section: 'Miscellaneous',
	spec: [{
		label: 'Text Select',
		path: 'textSelect',
		ops: [
			{ label: 'Caramel', value: 'caramel' },
			{ label: 'Chocolate', value: 'chocolate' },
			{ label: 'Strawberry', value: 'strawberry' },
			{ label: 'Vanilla', value: 'vanilla' },
		],
		value: 'chocolate',
	}, {
		label: 'Numeric Select',
		path: 'numericSelect',
		numeric: true,
		ops: [
			{ label: 'One', value: 1 },
			{ label: 'Two', value: 2 },
			{ label: 'Three', value: 3 },
		],
		value: 'chocolate',
	}],
};
