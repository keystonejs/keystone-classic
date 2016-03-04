var keystone = require('../../../');
var _ = require('lodash');
var querystring = require('querystring');

module.exports = function (req, res) {

	var viewLocals = {
		validationErrors: {},
		showCreateForm: _.has(req.query, 'new'),
	};
	var appName = keystone.get('name') || 'Keystone';
	var renderView = function () {
		keystone.render(req, res, 'list', _.extend(viewLocals, {
			section: keystone.nav.by.list[req.list.key] || {},
			title: appName + ': ' + req.list.plural,
			page: 'list',
			list: req.list,
			submitted: req.body || {},
		}));
	};

	var checkCSRF = function () {
		var pass = keystone.security.csrf.validate(req);
		if (!pass) {
			console.error('CSRF failure');
			req.flash('error', 'There was a problem with your request, please try again.');
		}
		return pass;
	};

	var item;
	if (!req.list.get('nocreate') && req.list.get('autocreate') && _.has(req.query, 'new')) {

		if (!checkCSRF()) return renderView();

		item = new req.list.model();
		item.save(function (err) {
			if (err) {
				console.log('There was an error creating the new ' + req.list.singular + ':');
				console.error(err);
				req.flash('error', 'There was an error creating the new ' + req.list.singular + '.');
				renderView();
			} else {
				req.flash('success', 'New ' + req.list.singular + ' ' + req.list.getDocumentName(item) + ' created.');
				return res.redirect('/' + keystone.get('admin path') + '/' + req.list.path + '/' + item.id);
			}
		});

	} else if (!req.list.get('nocreate') && req.method === 'POST' && req.body.action === 'create') {

		if (!checkCSRF()) return renderView();

		item = new req.list.model();
		var updateHandler = item.getUpdateHandler(req);

		viewLocals.showCreateForm = true; // always show the create form after a create. success will redirect.

		var processUpdateHandler = function () {
			updateHandler.process(req.body, {
				// flashErrors: true,
				logErrors: true,
				fields: req.list.initialFields,
			}, function (err) {
				if (err) {
					viewLocals.createErrors = err;
					return renderView();
				}
				req.flash('success', 'New ' + req.list.singular + ' ' + req.list.getDocumentName(item) + ' created.');
				return res.redirect('/' + keystone.get('admin path') + '/' + req.list.path + '/' + item.id);
			});
		};

		if (req.list.nameIsInitial) {
			if (!req.list.nameField.inputIsValid(req.body, true, item)) {
				updateHandler.addValidationError(req.list.nameField.path, req.list.nameField.label + ' is required.');
			}
			req.list.nameField.updateItem(item, req.body, processUpdateHandler);
		} else {
			processUpdateHandler();
		}

	} else {
		renderView();
	}
};
