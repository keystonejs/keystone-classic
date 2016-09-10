module.exports = {
	Field: require('../TextField'),
	Filter: require('../TextFilter'),
	readme: require('fs').readFileSync('./fields/types/text/Readme.md', 'utf8'),
	section: 'Text',
	spec: {
		label: 'Text',
		path: 'text',
		value: 'Hello World',
	},
};
