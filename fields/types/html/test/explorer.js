module.exports = {
	Field: require('../HtmlField'),
	Filter: require('../HtmlFilter'),
	readme: require('fs').readFileSync('./fields/types/html/Readme.md', 'utf8'),
	section: 'Text',
	spec: {
		label: 'Html',
		path: 'html',
		value: '<p>Hello World!</p>',
		wysiwyg: true,
	},
};
