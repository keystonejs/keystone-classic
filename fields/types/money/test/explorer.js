module.exports = {
	Field: require('../MoneyField'),
	Filter: require('../MoneyFilter'),
	readme: require('fs').readFileSync('./fields/types/money/Readme.md', 'utf8'),
	section: 'Number',
	spec: {
		label: 'Money',
		path: 'text',
		value: 0,
	},
};
