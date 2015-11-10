module.exports = function(keystone) {
	return {
		sortable: require('./schemaPlugins/sortable'),
		autokey: require('./schemaPlugins/autokey'),
		track: require('./schemaPlugins/track')(keystone),
		history: require('./schemaPlugins/history')(keystone),
		methods: {
			getRelated: require('./schemaPlugins/methods/getRelated')(keystone.list),
			populateRelated: require('./schemaPlugins/methods/populateRelated')
		},
		options: {
			transform: require('./schemaPlugins/options/transform')
		}
	};
};
