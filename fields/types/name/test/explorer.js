module.exports = {
	Field: require('../NameField'),
	Filter: require('../NameFilter'),
	spec: {
		label: 'Name Field',
		path: 'name',
		paths: {
			first: 'name.first',
			last: 'name.last',
		},
	},
	value: {
		first: 'Jed',
		last: 'Watson',
	},
};
