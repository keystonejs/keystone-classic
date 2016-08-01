module.exports = {
	Field: require('../DatetimeField'),
	Filter: require('../DatetimeFilter'),
	readme: require('fs').readFileSync('./fields/types/datetime/Readme.md', 'utf8'),
	section: 'Date',
	spec: {
		label: 'Datetime',
		path: 'datetime',
		paths: {
			date: 'datetime.date',
			time: 'datetime.time',
		},
		value: new Date(),
	},
};
