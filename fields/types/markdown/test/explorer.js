module.exports = {
	Field: require('../MarkdownField'),
	Filter: require('../MarkdownFilter'),
	readme: require('../Readme.md'),
	section: 'Text',
	spec: {
		label: 'Markdown',
		path: 'markdown',
		paths: {
			html: 'markdown.html',
			md: 'markdown.md',
		},
		wysiwyg: true,
		toolbarOptions: {},
		value: {
			html: '<p><em>Hello World!</em></p>',
			md: '*Hello World!*',
		},
	},
};
