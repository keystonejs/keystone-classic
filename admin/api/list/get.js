var async = require('async');

module.exports = function(req, res) {
	var query = req.list.model.find();
	async.series({
		count: function(next) {
			query.count(next);
		},
		items: function(next) {
			query.find();
			query.limit(Number(req.query.limit) || 100);
			query.skip(Number(req.query.skip) || 0);
			query.exec(next);
		}
	}, function(err, results) {
		if (err) return res.apiError('database error', err);
		return res.json({
			results: results.items.map(function (item) {
				return req.list.getData(item, req.query.select);
			}),
			count: results.count
		});
	});
};
