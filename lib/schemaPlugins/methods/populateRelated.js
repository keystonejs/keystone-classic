var _ = require('lodash');

module.exports = function populateRelated (rel, callback) {

	var item = this;

	if (typeof callback !== 'function') {
		throw new Error('List.populateRelated(rel, callback) requires a callback function.');
	}

	this.getRelated(rel, function (err, results) {
		_.forEach(results, function (data, key) {
			item[key] = data;
		});
		callback(err, results);
	}, true);

};
