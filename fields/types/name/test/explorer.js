module.exports = {
	Field: require('../NameField'),
	Filter: require('../NameFilter'),
	section: 'Text',
	spec: {
		label: 'Name',
		path: 'name',
		paths: {
			first: 'name.first',
			middle: 'name.middle',
			last: 'name.last',
		},
		value: {
			first: 'Michael',
			middle: 'Andrew',
			last: 'Fox',
		},
	},
};
