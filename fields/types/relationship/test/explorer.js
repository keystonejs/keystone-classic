module.exports = {
	Field: require('../RelationshipField'),
	Filter: require('../RelationshipFilter'),
	readme: require('fs').readFileSync('./fields/types/relationship/Readme.md', 'utf8'),
	section: 'Miscellaneous',
	spec: {
		label: 'Relationship',
		path: 'relationship',
		// createInline isn't available in the explorer because it depends on
		// real list definitions and the FieldTypes bundle
		// createInline: true,
		refList: {
			key: 'Flavour',
			path: 'flavours',
			plural: 'Flavours',
			singular: 'Flavour',
		},
		value: '',
	},
};
