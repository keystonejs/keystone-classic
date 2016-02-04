var async = require('async');

module.exports = function (req, res) {
	var where = {};
	var filters = req.query.filters;
	if (filters && typeof filters === 'string') {
		try { filters = JSON.parse(req.query.filters); }
		catch (e) { } // eslint-disable-line no-empty
	}
	if (typeof filters === 'object') {
		req.list.addFiltersToQuery(filters, where);
	}
	if (req.query.search) {
		req.list.addSearchToQuery(req.query.search, where);
	}
	var query = req.list.model.find(where);
	if (req.query.populate) {
		query.populate(req.query.populate);
	}
	if (req.query.expandRelationshipFields && req.query.expandRelationshipFields !== 'false') {
		req.list.relationshipFields.forEach(function (i) {
			query.populate(i.path);
		});
	}
	var sort = req.list.expandSort(req.query.sort);
	async.series({
		count: function (next) {
			query.count(next);
		},
		items: function (next) {
			query.find();
			query.limit(Number(req.query.limit) || 100);
			query.skip(Number(req.query.skip) || 0);
			query.sort(sort.string);
			query.exec(next);
		},
	}, function (err, results) {
		if (err) {
			res.logError('admin/server/api/list/get', 'database error finding items', err);
			return res.apiError('database error', err);
		}
		return res.json({
			results: results.items.map(function (item) {
				return req.list.getData(item, req.query.select, req.query.expandRelationshipFields);
			}),
			count: results.count,
		});
	});
};
