module.exports = {
	Field: require('../TextareaField'),
	Filter: require('../TextareaFilter'),
	readme: require('fs').readFileSync('./fields/types/textarea/Readme.md', 'utf8'),
	section: 'Text',
	spec: {
		label: 'Textarea',
		path: 'textarea',
		value: 'Hello World',
	},
};
