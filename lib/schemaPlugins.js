exports.sortable = require('./schemaPlugins/sortable');
exports.autokey = require('./schemaPlugins/autokey');
exports.track = require('./schemaPlugins/track');
exports.softDelete = require('./schemaPlugins/softDelete');
exports.history = require('./schemaPlugins/history');

exports.methods = {
	getRelated: require('./schemaPlugins/methods/getRelated'),
	populateRelated: require('./schemaPlugins/methods/populateRelated'),
	softDelete: require('./schemaPlugins/methods/softDelete'),
};

exports.options = {
	transform: require('./schemaPlugins/options/transform'),
};
