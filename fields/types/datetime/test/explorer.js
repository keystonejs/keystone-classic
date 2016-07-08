module.exports = {
	Field: require('../DatetimeField'),
	Filter: require('../DatetimeFilter'),
	section: 'Date',
	spec: {
		label: 'Datetime',
		path: 'datetime',
		paths: {
			date: 'datetime.date',
			time: 'datetime.time',
		},
	},
	value: new Date(),
};
