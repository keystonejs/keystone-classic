module.exports = {
	Field: require('../JsonField'),
	Filter: require('../JsonFilter'),
	readme: require('fs').readFileSync('./fields/types/code/Readme.md', 'utf8'),
	section: 'Text',
	spec: {
		label: 'Json',
		path: 'json',
		value: '{ name: \'hello world\'}',
	},
};
