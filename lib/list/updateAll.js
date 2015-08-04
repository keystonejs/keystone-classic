var async = require('async');

/**
 * Updates every document in a List,
 * setting the provided data on each.
 *
 * @param {Object} data
 * @param {Function} callback (optional)
 */
function updateAll (data, callback) {
	if ('function' === typeof data) {
		callback = data;
		data = null;
	}
	callback = callback || function () {};
	this.model.find(function (err, results) {
		if (err) return callback(err);
		async.eachSeries(results, function (doc, next) {
			if (data) {
				doc.set(data);
			}
			doc.save(next);
		}, function (err) {
			callback(err);
		});
	});
}

module.exports = updateAll;
