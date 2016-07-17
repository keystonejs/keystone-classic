module.exports = {
	Field: require('../DateField'),
	Filter: require('../DateFilter'),
	readme: require('fs').readFileSync('./fields/types/date/Readme.md', 'utf8'),
	section: 'Date',
	spec: {
		label: 'Date',
		path: 'date',
		value: '2016-07-11',
	},
};
