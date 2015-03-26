var _ = require('underscore');

module.exports = function populateRelated(rel, callback) {

	var item = this;

	if ('function' !== typeof callback) {
		throw new Error('List.populateRelated(rel, callback) requires a callback function.');
	}

	this.getRelated(rel, function(err, results) {
		_.each(results, function(data, key) {
			item[key] = data;
		});
		callback(err, results);
	}, true);

};
