/*
Deprecated. Any remaining usage of these functions needs to be replaced
with calls to the new API endpoints.
*/

var _ = require('lodash');
var async = require('async');

module.exports = function (req, res) {

	var keystone = req.keystone;

	var sendResponse = function (status) {
		res.json(status);
	};

	var sendError = function (key, err, msg) {
		msg = msg || 'API Error';
		key = key || 'unknown error';
		msg += ' (' + key + ')';
		console.log(msg + (err ? ':' : ''));
		if (err) {
			console.log(err);
		}
		res.status(500);
		sendResponse({ error: key || 'error', detail: err ? err.message : '' });
	};

	switch (req.params.action) {

		case 'autocomplete':
			var limit = req.query.limit || 50;
			var page = req.query.page || 1;
			var skip = limit * (page - 1);
			var filters = req.list.getSearchFilters(req.query.q);
			var count = req.list.model.count(filters);
			var query = req.list.model.find(filters)
				.limit(limit)
				.skip(skip)
				.sort(req.list.defaultSort);
			if (req.query.context === 'relationship') {
				var srcList = keystone.list(req.query.list);
				if (!srcList) return sendError('invalid list provided');

				var field = srcList.fields[req.query.field];
				if (!field) return sendError('invalid field provided');

				_.forEach(req.query.filters, function (value, key) {
					query.where(key).equals(value ? value : null);
					count.where(key).equals(value ? value : null);
				});
			}
			count.exec(function (err, total) {
				if (err) return sendError('database error', err);
				query.exec(function (err, items) {
					if (err) return sendError('database error', err);
					sendResponse({
						total: total,
						items: items.map(function (i) {
							return {
								name: req.list.getDocumentName(i, false) || '(' + i.id + ')',
								id: i.id,
							};
						}),
					});
				});
			});
			break;

		case 'order':
			if (!keystone.security.csrf.validate(req)) {
				return sendError('invalid csrf');
			}
			var order = req.query.order || req.body.order;
			var queue = [];
			if (typeof order === 'string') {
				order = order.split(',');
			}
			_.forEach(order, function (id, i) {
				queue.push(function (done) {
					req.list.model.update({ _id: id }, { $set: { sortOrder: i } }, done);
				});
			});
			async.parallel(queue, function (err) {
				if (err) return sendError('database error', err);
				return sendResponse({
					success: true,
				});
			});
			break;

	}

};
