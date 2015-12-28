var _ = require('underscore');
var async = require('async');
var keystone = require('../../../');

module.exports = function(req, res) {

	var sendResponse = function(status) {
		res.json(status);
	};

	var sendError = function(key, err, msg) {
		msg = msg || 'API Error';
		key = key || 'unknown error';
		msg += ` (${key})`;
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

				_.each(req.query.filters, function(value, key) {
					query.where(key).equals(value ? value : null);
					count.where(key).equals(value ? value : null);
				});
			}
			count.exec(function(err, total) {
				if (err) return sendError('database error', err);
				query.exec(function(err, items) {
					if (err) return sendError('database error', err);
					sendResponse({
						total: total,
						items: items.map(function(i) {
							return {
								name: req.list.getDocumentName(i, false) || '(' + i.id + ')',
								id: i.id
							};
						})
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
			if ('string' === typeof order) {
				order = order.split(',');
			}
			_.each(order, function(id, i) {
				queue.push(function(done) {
					req.list.model.update({ _id: id }, { $set: { sortOrder: i } }, done);
				});
			});
			async.parallel(queue, function(err) {
				if (err) return sendError('database error', err);
				return sendResponse({
					success: true
				});
			});
		break;

		case 'create':
			if (!keystone.security.csrf.validate(req)) {
				return sendError('invalid csrf');
			}
			var item = new req.list.model();
			var updateHandler = item.getUpdateHandler(req);
			var data = (req.method === 'POST') ? req.body : req.query;
			if (req.list.nameIsInitial) {
				if (req.list.nameField.inputIsValid(data)) {
					req.list.nameField.updateItem(item, data);
				} else {
					updateHandler.addValidationError(req.list.nameField.path, 'Name is required.');
				}
			}
			updateHandler.process(data, {
				flashErrors: true,
				logErrors: true,
				fields: req.list.initialFields
			}, function(err) {
				if (err) {
					return sendResponse({
						success: false,
						err: err
					});
				} else {
					return sendResponse({
						success: true,
						name: req.list.getDocumentName(item, false),
						id: item.id
					});
				}
			});
		break;

	}

};
