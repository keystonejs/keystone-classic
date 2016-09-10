module.exports = {
	Field: require('../NameField'),
	Filter: require('../NameFilter'),
	section: 'Text',
	spec: {
		label: 'Name',
		path: 'name',
		paths: {
			first: 'name.first',
			last: 'name.last',
		},
		value: {
			first: 'Jed',
			last: 'Watson',
		},
	},
};
