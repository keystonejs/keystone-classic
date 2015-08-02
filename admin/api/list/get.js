var async = require('async');

module.exports = function(req, res) {
	var filters = req.query.filters;
	if (filters && typeof filters === 'string') {
		try { filters = JSON.parse(req.query.filters); }
		catch(e) { } // eslint-disable-line no-empty
	}
	if (typeof filters === 'object') {
		filters = req.list.addFiltersToQuery(filters);
	}
	var query = req.list.model.find(filters);
	async.series({
		count: function(next) {
			query.count(next);
		},
		items: function(next) {
			query.find();
			query.limit(Number(req.query.limit) || 100);
			query.skip(Number(req.query.skip) || 0);
			query.sort(req.query.sort || req.list.defaultSort);
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
