var _ = require('underscore'),
	moment = require('moment'),
	prospekt = require('../');

exports = module.exports = function(req, res) {
	
	var viewLocals = {
		validationErrors: {}
	};
	
	var renderView = function() {
		var columns = req.list.defaultColumns;
		var q = req.list.paginate({ page: req.params.page }).sort(req.list.defaultSort); // TODO: .populate(req.list.populate.join(' '));
		q.exec(function(err, items) {
			//console.log(items);
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
			req.list.nameField.updateItem(item, req.body);
		}
		
		_.each(req.list.initialFields, function(field) {
			field.updateItem(item, req.body);
		});
		
		/*
		if (req.list.nameIsInitial)
			item.set(req.list.map('name'), req.body[req.list.map('name')])
		
		_.each(req.list.initialFields, function(field) {
			
			switch (field.fieldType) {
				case 'checkbox':
					if (_.has(req.body, field.path) && req.body[field.path] == 'true')
						item.set(field.path, true);
				break;
				case 'date':
				case 'datetime':
					if (_.has(req.body, field.path)) {
						var newValue = moment(req.body[field.path]);
						if (newValue.isValid)
							item.set(field.path, newValue.toDate());
					}
				break;
				case 'password':
					if (req.body[field.path]) {
						// validate matching passwords
						if (req.body[field.path] == req.body[field.path + '_confirm']) {
							item.set(field.path, req.body[field.path]);
						} else {
							validationErrors.push('Passwords must match.');
						}	
					}
				break;
				default:
					if (_.has(req.body, field.path))
						item.set(field.path, req.body[field.path]);
			}
			
		});
		*/
		
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
			}
			res.redirect('/prospekt/' + req.list.path + '/' + item.id);
		});
		
		return;
	}
	
	renderView();
	
}