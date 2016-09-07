module.exports = {
	Field: require('../DatetimeField'),
	Filter: require('../DatetimeFilter'),
	readme: require('../Readme.md'),
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
