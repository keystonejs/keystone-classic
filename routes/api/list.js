var _ = require('underscore'),
	async = require('async'),
	keystone = require('../../'),
	jade = require('jade');

exports = module.exports = function(req, res) {

	var sendResponse = function(status) {
		res.json(status);
	};

	var sendError = function(key, err, msg) {
		msg = msg || 'API Error';
		key = key || 'unknown error';
		msg += ' (' + key + ')';
		console.log(msg + (err ? ':' : ''));
		if (err) {
			console.log(err);
		}
		res.status(500);
		sendResponse({ error: key || 'error', detail: err });
	};

	switch (req.params.action) {

		case 'autocomplete':

			var limit = req.query.limit || 10,
				page = req.query.page || 1,
				skip = limit * (page - 1);

			var filters = req.list.getSearchFilters(req.query.q);

			var count = req.list.model.count(filters),
				query = req.list.model.find(filters)
					.limit(limit)
					.skip(skip)
					.sort(req.list.defaultSort);

			var doQuery = function() {
				count.exec(function(err, total) {

					if (err) return sendError('database error', err);

					query.exec(function(err, items) {

						if (err) return sendError('database error', err);

						sendResponse({
							total: total,
							items: items.map(function(i) {
								return {
									name: req.list.getDocumentName(i, true) || '(' + i.id + ')',
									id: i.id
								};
							})
						});

					});

				});
			};

			if (req.query.context === 'relationship') {

				var srcList = keystone.list(req.query.list);

				if (!srcList) return sendError('invalid list provided');

				var field = srcList.fields[req.query.field];

				if (!field || field.type !== 'relationship') return sendError('invalid field provided');

				if (!field.hasFilters) {
					return doQuery();
				}

				_.each(req.query.filters, function(value, key) {
					query.where(key).equals(value ? value : null);
					count.where(key).equals(value ? value : null);
				});
				return doQuery();

			} else {
				return doQuery();
			}


		break;

		case 'get':

			req.list.model.findById(req.query.id).exec(function(err, item) {

				if (err) return sendError('database error', err);
				if (!item) return sendResponse({ name: req.query.id, id: req.query.id });

				switch (req.query.dataset) {
					case 'simple':
						return sendResponse({
							name: req.list.getDocumentName(item, true),
							id: item.id
						});
					default:
						return sendResponse(item);
				}
			});

		break;

		case 'order':

			if (!keystone.security.csrf.validate(req)) {
				return sendError('invalid csrf');
			}

			var order = req.query.order || req.body.order,
				queue = [];

			if ('string' === typeof order) {
				order = order.split(',');
			}

			_.each(order, function(id, i) {
				queue.push(function(done) {
					req.list.model.update({ _id: id }, { $set: { sortOrder: i }}, done);
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

			var item = new req.list.model(),
				updateHandler = item.getUpdateHandler(req),
				data = (req.method === 'POST') ? req.body : req.query;

			if (req.list.nameIsInitial) {
				if (req.list.nameField.validateInput(data)) {
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
						name: req.list.getDocumentName(item, true),
						id: item.id
					});
				}
			});

		break;

		case 'delete':

			if (!keystone.security.csrf.validate(req)) {
				return sendError('invalid csrf');
			}

			if (req.list.get('nodelete')) {
				return sendError('nodelete');
			}

			var id = req.body.id || req.query.id;

			req.list.model.findById(id).exec(function (err, item) {

				if (err) return sendError('database error', err);
				if (!item) return sendError('not found');

				item.remove(function (err) {
					if (err) return sendError('database error', err);

					return sendResponse({
						success: true,
						count: 1
					});
				});

			});

		break;

		case 'fetch':
			if (!keystone.security.csrf.validate(req)) {
				return sendError('invalid csrf');
			}

			var queryFilters = req.list.getSearchFilters(req.query.search, req.query.filters),
				skip = parseInt(req.query.items.last) - 1,
				querystring = require('querystring'),
				link_to = function(params) {
					var p = params.page || '';
					delete params.page;
					var queryParams = _.clone(req.query.q);
					for (var i in params) {
						if (params[i] === undefined) {
							delete params[i];
							delete queryParams[i];
						}
					}
					params = querystring.stringify(_.defaults(params, queryParams));
					return '/keystone/' + req.list.path + (p ? '/' + p : '') + (params ? '?' + params : '');
				};

			var query = req.list.model.find(queryFilters).sort(req.query.sort).skip(skip).limit(1),
				columns = req.list.expandColumns(req.query.cols);

			req.list.selectColumns(query, columns);

			query.exec(function(err, items) {
				if (err) return sendError('database error', err);
				if (!items) return sendError('not found');

				var locals, row, pagination;

				req.list.getPages(req.query.items, req.list.pagination.maxPages);

				locals = { list: req.list, columns: columns, item: items[0], csrf_query: req.query.csrf_query, _:_ };
				row = jade.renderFile(__dirname + '/../../templates/partials/row.jade', locals);
				pagination = jade.renderFile(__dirname + '/../../templates/partials/pagination.jade', {items: req.query.items, link_to: link_to });

				return sendResponse({
					item: items[0],
					row: row,
					pagination: pagination,
					success: true,
					count: 1
				});
			});

		break;

	}

};
