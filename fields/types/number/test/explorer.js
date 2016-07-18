module.exports = {
	Field: require('../NumberField'),
	Filter: require('../NumberFilter'),
	readme: require('fs').readFileSync('./fields/types/number/Readme.md', 'utf8'),
	section: 'Number',
	spec: {
		label: 'Number',
		path: 'text',
		value: 0,
	},
};
