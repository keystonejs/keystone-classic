var _ = require('underscore'),
	moment = require('moment'),
	querystring = require('querystring'),
	keystone = require('../'),
	utils = require('../lib/utils');

exports = module.exports = function(req, res) {
	
	var viewLocals = {
		validationErrors: {},
		showCreateForm: _.has(req.query, 'new')
	};
	
	var sort = { by: req.query.sort || req.list.defaultSort },
		filters = (req.query.q) ? req.list.processFilters(req.query.q) : {};
		// filters = (req.query.search) ? req.list.getSearchFilters(req.query.search) : {};
	
	if (sort.by) {
		
		sort.inv = sort.by.charAt(0) == '-';
		sort.path = (sort.inv) ? sort.by.substr(1) : sort.by;
		sort.field = req.list.fields[sort.path];
		
		if (!sort.field) {
			delete req.query.sort;
			var qs = querystring.stringify(req.query);
			return res.redirect(req.path + ((qs) ? '?' + ps : ''));
		}
		
		sort.label = sort.field.label;
		
	}
	
	var renderView = function() {
		
		var query = req.list.paginate({ /*filters: filters,*/ page: req.params.page }).sort(sort.by);
		
		var columns = req.list.defaultColumns;
		req.list.selectColumns(query, columns);
		
		var link_to = function(x) {
			return '/keystone/' + req.list.path + '?' + querystring.stringify(x);
		}
		
		query.exec(function(err, items) {
			keystone.render(req, res, 'list', _.extend(viewLocals, {
				section: req.list.key,
				title: 'Keystone: ' + req.list.plural,
				link_to: link_to,
				list: req.list,
				sort: sort,
				filters: filters,
				search: req.query.search,
				columns: columns,
				items: items,
				submitted: req.body || {}
			}));
		});
		
	}
	
	if (!req.list.get('nodelete') && req.query['delete']) {
		req.list.model.findById(req.query['delete']).remove(function(err, count) {
			if (count) {
				req.flash('success', req.list.singular + ' deleted successfully.');
			}
			res.redirect('/keystone/' + req.list.path);
		});
		
		return;
	}
	
	if (!req.list.get('nocreate') && req.method == 'POST' && req.body.action == 'create') {
		
		var validationErrors = [];
		viewLocals.showCreateForm = true; // always show the create form after a create. success will redirect.
		
		var item = new req.list.model();
		
		if (req.list.nameIsInitial) {
			if (req.list.nameField.validateInput(req.body))
				req.list.nameField.updateItem(item, req.body);
			else
				validationErrors.push('Name is required.');
		}
		
		_.each(req.list.initialFields, function(field) {
			
			// Some field types have custom behaviours
			switch (field.type) {
				
				case 'password':
					// validate matching password fields
					if (req.body[field.path] != req.body[field.paths.confirm])
						return validationErrors.push('Passwords must match.');
				break;
				
				case 'email':
					if (req.body[field.path] && !utils.isEmail(req.body[field.path]))
						return validationErrors.push('Please enter a valid email address in the ' + field.label + ' field.');
				break;
			}
			
			// validate required fields
			if (field.required && !field.validateInput(req.body))
				return validationErrors.push(field.label + ' is required.');
			
			field.updateItem(item, req.body);
			
		});
		
		if (validationErrors.length) {
			_.each(validationErrors, function(i) { req.flash('error', i); });
			return renderView();
		}
		
		item.save(function(err, item) {
			if (err) {
				if (err.name == 'ValidationError') {
					viewLocals.validationErrors = err.errors;
					_.each(err.errors, function(e, path) {
						if (e.type == 'required') {
							req.flash('error', 'Field ' + path + ' is required.');
						}
					});
				} else {
					console.error('Error creating new ' + req.list.singular + ':');
					console.error(err);
					req.flash('error', 'There was an error creating the new ' + req.list.singular + '. Please check the console.');
				}
				return renderView();
			} else {
				req.flash('success', 'New ' + req.list.singular + ' ' + req.list.getDocumentName(item) + ' created.');
				res.redirect('/keystone/' + req.list.path + '/' + item.id);
			}
		});
		
		return;
	}
	
	renderView();
	
}