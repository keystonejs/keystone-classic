var keystone = require('../../'),
	_ = require('underscore'),
	querystring = require('querystring');

exports = module.exports = function(req, res) {
	
	var viewLocals = {
		validationErrors: {},
		showCreateForm: _.has(req.query, 'new')
	};
	
	var sort = { by: req.query.sort || req.list.defaultSort },
		filters = req.list.processFilters(req.query.q),
		cleanFilters = {},
		queryFilters = req.list.getSearchFilters(req.query.search, filters),
		columns = (req.query.cols) ? req.list.expandColumns(req.query.cols) : req.list.defaultColumns;
	
	_.each(filters, function(filter, path) {
		cleanFilters[path] = _.omit(filter, 'field');
	});
	
	if (sort.by) {
		
		sort.inv = sort.by.charAt(0) === '-';
		sort.path = (sort.inv) ? sort.by.substr(1) : sort.by;
		sort.field = req.list.fields[sort.path];
		
		var clearSort = function() {
			delete req.query.sort;
			var qs = querystring.stringify(req.query);
			return res.redirect(req.path + ((qs) ? '?' + qs : ''));
		};
		
		// clear the sort query value if it is the default sort value for the list
		if (req.query.sort === req.list.defaultSort) {
			return clearSort();
		}
		
		if (sort.field) {
			// the sort is set to a field, use its label
			sort.label = sort.field.label;
			// some fields have custom sort paths
			if (sort.field.type === 'name') {
				sort.by = sort.by + '.first ' + sort.by + '.last';
			}
		} else if (req.list.get('sortable') && (sort.by === 'sortOrder' || sort.by === '-sortOrder')) {
			// the sort is set to the built-in sort order, set the label correctly
			sort.label = 'display order';
		} else if (req.query.sort) {
			// it looks like an invalid path has been specified (no matching field), so clear the sort
			return clearSort();
		}
		
	}
	
	var renderView = function() {
		
		var query = req.list.paginate({ filters: queryFilters, page: req.params.page, perPage: req.list.get('perPage') }).sort(sort.by);
		
		req.list.selectColumns(query, columns);
		
		var link_to = function(params) {
			var p = params.page || '';
			delete params.page;
			var queryParams = _.clone(req.query);
			for (var i in params) {
				if (params[i] === undefined) {
					delete params[i];
					delete queryParams[i];
				}
			}
			params = querystring.stringify(_.defaults(params, queryParams));
			return '/keystone/' + req.list.path + (p ? '/' + p : '') + (params ? '?' + params : '');
		};
		
		query.exec(function(err, items) {
			
			if (err) {
				console.log(err);
				return res.status(500).send('Error querying items:<br><br>' + JSON.stringify(err));
			}
			
			// if there were results but not on this page, reset the page
			if (req.params.page && items.total && !items.results.length) {
				return res.redirect('/keystone/' + req.list.path);
			}
			
			// go straight to the result if there was a search, and only one result
			if (req.query.search && items.total === 1 && items.results.length === 1) {
				return res.redirect('/keystone/' + req.list.path + '/' + items.results[0].id);
			}
			
			var download_link = '/keystone/download/' + req.list.path,
				downloadParams = {};
				
			if (req.query.q) {
				downloadParams.q = req.query.q;
			}
			if (req.query.search) {
				downloadParams.search = req.query.search;
			}
			if (req.query.cols) {
				downloadParams.cols = req.query.cols;
			}
			
			downloadParams = querystring.stringify(downloadParams);
			
			if (downloadParams) {
				download_link += '?' + downloadParams;
			}
			
			var appName = keystone.get('name') || 'Keystone';
			
			keystone.render(req, res, 'list', _.extend(viewLocals, {
				section: keystone.nav.by.list[req.list.key] || {},
				title: appName + ': ' + req.list.plural,
				page: 'list',
				link_to: link_to,
				download_link: download_link,
				list: req.list,
				sort: sort,
				filters: cleanFilters,
				search: req.query.search,
				columns: columns,
				colPaths: _.pluck(columns, 'path'),
				items: items,
				submitted: req.body || {},
				query: req.query
			}));
			
		});
	
	};
	
	var checkCSRF = function() {
		var pass = keystone.security.csrf.validate(req);
		if (!pass) {
			console.error('CSRF failure');
			req.flash('error', 'There was a problem with your request, please try again.');
		}
		return pass;
	};
	
	var item;
	if ('update' in req.query) {
		
		if (!checkCSRF()) return renderView();
		
		(function() {
			var data = null;
			if (req.query.update) {
				try {
					data = JSON.parse(req.query.update);
				} catch(e) {
					req.flash('error', 'There was an error parsing the update data.');
					return renderView();
				}
			}
			req.list.updateAll(data, function(err) {
				if (err) {
					console.log('Error updating all ' + req.list.plural);
					console.log(err);
					req.flash('error', 'There was an error updating all ' + req.list.plural + ' (logged to console)');
				} else {
					req.flash('success', 'All ' + req.list.plural + ' updated successfully.');
				}
				res.redirect('/keystone/' + req.list.path);
			});
		})();
		
	} else if (!req.list.get('nodelete') && req.query['delete']) {
		
		if (!checkCSRF()) return renderView();
		
		if (req.query['delete'] === req.user.id) {
			req.flash('error', 'You can\'t delete your own ' + req.list.singular + '.');
			return renderView();
		}
		
		req.list.model.findById(req.query['delete']).exec(function (err, item) {
			if (err || !item) return res.redirect('/keystone/' + req.list.path);
			
			item.remove(function (err) {
				if (err) {
					console.log('Error deleting ' + req.list.singular);
					console.log(err);
					req.flash('error', 'Error deleting the ' + req.list.singular + ': ' + err.message);
				} else {
					req.flash('success', req.list.singular + ' deleted successfully.');
				}
				res.redirect('/keystone/' + req.list.path);
			});
		});
		
		return;
		
	} else if (!req.list.get('nocreate') && req.list.get('autocreate') && _.has(req.query, 'new')) {
		
		if (!checkCSRF()) return renderView();
		
		item = new req.list.model();
		item.save(function(err) {
			
			if (err) {
				console.log('There was an error creating the new ' + req.list.singular + ':');
				console.log(err);
				req.flash('error', 'There was an error creating the new ' + req.list.singular + '.');
				renderView();
			} else {
				req.flash('success', 'New ' + req.list.singular + ' ' + req.list.getDocumentName(item) + ' created.');
				return res.redirect('/keystone/' + req.list.path + '/' + item.id);
			}
			
		});
		
	} else if (!req.list.get('nocreate') && req.method === 'POST' && req.body.action === 'create') {
		
		if (!checkCSRF()) return renderView();
		
		item = new req.list.model();
		var updateHandler = item.getUpdateHandler(req);
		
		viewLocals.showCreateForm = true; // always show the create form after a create. success will redirect.
		
		if (req.list.nameIsInitial) {
			if (!req.list.nameField.validateInput(req.body, true, item)) {
				updateHandler.addValidationError(req.list.nameField.path, req.list.nameField.label + ' is required.');
			}
			req.list.nameField.updateItem(item, req.body);
		}
		
		updateHandler.process(req.body, {
			// flashErrors: true,
			logErrors: true,
			fields: req.list.initialFields
		}, function(err) {
			if (err) {
				viewLocals.createErrors = err;
				return renderView();
			}
			req.flash('success', 'New ' + req.list.singular + ' ' + req.list.getDocumentName(item) + ' created.');
			return res.redirect('/keystone/' + req.list.path + '/' + item.id);
		});
		
	} else {
		
		renderView();
		
	}
};
