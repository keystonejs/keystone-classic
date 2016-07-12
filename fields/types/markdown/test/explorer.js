module.exports = {
	Field: require('../MarkdownField'),
	Filter: require('../MarkdownFilter'),
	readme: require('fs').readFileSync('./fields/types/markdown/Readme.md', 'utf8'),
	section: 'Text',
	spec: {
		label: 'Markdown',
		path: 'markdown',
		paths: {
			html: 'markdown.html',
			md: 'markdown.md',
		},
	},
	value: '*Hello World!*',
};
