var _ = require('underscore'),
	moment = require('moment'),
	keystone = require('../'),
	utils = require('../lib/utils');

exports = module.exports = function(req, res) {
	
	var viewLocals = {
		validationErrors: {},
		showCreateForm: false
	};
	
	var renderView = function() {
		var q = req.list.paginate({ page: req.params.page }).sort(req.list.defaultSort);
		var columns = req.list.defaultColumns;
		req.list.selectColumns(q, columns);
		q.exec(function(err, items) {
			keystone.render(req, res, 'list', _.extend(viewLocals, {
				section: req.list.key,
				list: req.list,
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
			viewLocals.showCreateForm = true;
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