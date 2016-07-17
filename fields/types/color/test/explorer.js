module.exports = {
	Field: require('../ColorField'),
	Filter: require('../ColorFilter'),
	readme: require('fs').readFileSync('./fields/types/color/Readme.md', 'utf8'),
	section: 'Text',
	spec: {
		label: 'Color',
		path: 'color',
		value: 'white',
	},
};
