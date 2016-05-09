var async = require('async');
var assign = require('object-assign');

module.exports = function (req, res) {
	var where = {};
	var filters = req.query.filters;
	if (filters && typeof filters === 'string') {
		try { filters = JSON.parse(req.query.filters); }
		catch (e) { } // eslint-disable-line no-empty
	}
	if (typeof filters === 'object') {
		assign(where, req.list.addFiltersToQuery(filters));
	}
	if (req.query.search) {
		assign(where, req.list.addSearchToQuery(req.query.search));
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
	async.waterfall([
		function (next) {
			query.count(next);
		},
		function (count, next) {
			var skipCount = Number(req.query.skip) || 0;
			query.find();
			query.limit(Number(req.query.limit) || 100);
			if (count > skipCount) {
				query.skip(skipCount);
			}
			query.sort(sort.string);
			query.exec(function (err, items) {
				next(err, count, items);
			});
		},
	], function (err, count, items) {
		if (err) {
			res.logError('admin/server/api/list/get', 'database error finding items', err);
			return res.apiError('database error', err);
		}
		return res.json({
			results: items.map(function (item) {
				return req.list.getData(item, req.query.select, req.query.expandRelationshipFields);
			}),
			count: count,
		});
	});
};
