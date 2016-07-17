module.exports = {
	Field: require('../CodeField'),
	Filter: require('../CodeFilter'),
	readme: require('fs').readFileSync('./fields/types/code/Readme.md', 'utf8'),
	section: 'Text',
	spec: {
		label: 'Code',
		path: 'text',
		value: '<p>Hello World!</p>',
	},
};
