var _ = require('underscore'),
	moment = require('moment'),
	prospekt = require('../');

exports = module.exports = function(req, res) {
	
	var viewLocals = {
		validationErrors: {},
		showCreateForm: false
	};
	
	var renderView = function() {
		var columns = req.list.defaultColumns;
		var q = req.list.paginate({ page: req.params.page }).sort(req.list.defaultSort); // TODO: .populate(req.list.populate.join(' '));
		q.exec(function(err, items) {
			prospekt.render(req, res, 'list', _.extend(viewLocals, {
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
			res.redirect('/prospekt/' + req.list.path);
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
				validationErrors.push('Please provide a name.');
		}
		
		_.each(req.list.initialFields, function(field) {
			
			// validate matching password fields
			if (field.type == 'password' && req.body[field.path] != req.body[field.path + '_confirm'])
				return validationErrors.push('Passwords must match.');
			
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
			}
			res.redirect('/prospekt/' + req.list.path + '/' + item.id);
		});
		
		return;
	}
	
	renderView();
	
}