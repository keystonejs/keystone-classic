module.exports = {
	Field: require('../DatetimeField'),
	Filter: require('../DatetimeFilter'),
	spec: {
		label: 'Datetime Field',
		path: 'datetime',
		paths: {
			date: 'datetime.date',
			time: 'datetime.time',
		},
	},
	value: new Date(),
};
