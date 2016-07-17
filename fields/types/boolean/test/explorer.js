module.exports = {
	Field: require('../BooleanField'),
	Filter: require('../BooleanFilter'),
	readme: require('fs').readFileSync('./fields/types/boolean/Readme.md', 'utf8'),
	section: 'Miscellaneous',
	spec: {
		label: 'Boolean',
		path: 'boolean',
		value: false,
	},
};
