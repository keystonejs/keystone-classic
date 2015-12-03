var async = require('async');

module.exports = function(lists) {
	return function(req, res) {
		var counts = {};
		async.each(lists, function(list, next) {
			list.model.count(function(err, count) {
				counts[list.key] = count;
				next(err);
			});
		}, function(err, results) {
			if (err) return res.apiError('database error', err);
			return res.json({
				counts: counts
			});
		});
	}
};
