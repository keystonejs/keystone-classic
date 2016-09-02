module.exports = {
	Field: require('../TwitterField'),
	Filter: require('../TwitterFilter'),
	readme: require('fs').readFileSync('./fields/types/twitter/Readme.md', 'utf8'),
	section: 'Text',
	spec: {
		label: 'Twitter',
		path: 'twitter',
		value: 'http://keystonejs.com',
	},
};
