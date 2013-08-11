var _ = require('underscore'),
	async = require('async'),
	keystone = require('../'),
	utils = require('./utils');


/**
 * UpdateHandler Class
 *
 * @param {Object} item to update
 * @api public
 */

function UpdateHandler(list, item, req) {
	
	if (!(this instanceof UpdateHandler))
		return new UpdateHandler(list, item);
	
	this.list = list;
	this.item = item;
	this.req = req;
	
}


/**
 * Processes data from req.body, req.query, or any data source.
 * 
 * Options:
 * - fields (comma-delimited list or array of field paths)
 * - flashErrors (boolean, default false; whether to push validation errors to req.flash)
 * - ignoreNoedit (boolean, default false; whether to ignore noedit settings on fields)
 *
 * @param {Object} data
 * @param {Object} options (can be comma-delimited list of fields) (optional)
 * @param {Function} callback (optional)
 * @api public
 */

UpdateHandler.prototype.process = function(data, options, callback) {
	
	if ('function' == typeof options) {
		callback = options;
		options = null;
	}
	
	if (!options) {
		options = {};
	} else if ('string' == typeof options) {
		options = { fields: options };
	}
	
	if (!options.fields) {
		options.fields = _.keys(this.list.fields);
	} else if ('string' == typeof options.fields) {
		options.fields = options.fields.split(',').map(function(i) { return i.trim(); });
	}
	
	var actionQueue = [],
		validationErrors = {};
		
	var addValidationError = function(path, msg, type) {
		validationErrors[path] = {
			name: 'ValidatorError',
			path: path,
			message: msg,
			type: type || 'required'
		};
	}
	
	// TODO: The whole progress queue management code could be a lot neater...
	
	var progress = (function(err) {
		if (err) {
			callback(err, this);
		} else if (_.size(validationErrors)) {
			if (options.flashErrors) {
				this.req.flash('error', {
					type: 'ValidationError',
					title: 'There was a problem saving your changes:',
					list: _.pluck(validationErrors, 'message')
				});
			}
			callback({
				message: 'Validation failed',
				name: 'ValidationError',
				errors: validationErrors
			}, this);
		} else if (actionQueue.length) {
			// TODO: parallel queue handling
			actionQueue.pop()();
		} else {
			saveItem();
		}
	}).bind(this);
	
	var saveItem = (function() {
		this.item.save((function(err) {
			if (err && options.flashErrors) {
				if (err.name == 'ValidationError') {
					this.req.flash('error', {
						type: 'ValidationError',
						title: 'There was a problem saving your changes:',
						list: _.pluck(validationErrors, 'message')
					});
				} else {
					this.req.flash('error', 'There was an error saving your changes: ' + err.message + ' (' + err.name + (err.type ? ': ' + err.type : '') + ')');
				}
			}
			return callback(err, this);
		}).bind(this));
	}).bind(this);
	
	options.fields.forEach(function(path) {
		
		var field = this.list.field(path);
		
		if (!field) {
			throw new Error('UpdateHandler.process called with invalid field path: ' + path);
		}
		
		// skip uneditable fields
		if (!options.ignoreNoedit && field.noedit)
			return;
		
		// Some field types have custom behaviours
		switch (field.type) {
			
			case 'cloudinaryimage':
				actionQueue.push(field.getRequestHandler(this.item, this.req, function(err) {
					if (err && options.flashErrors) {
						req.flash('error', field.label + ' upload failed - ' + err.message);
					}
					progress(err);
				}));
			break;
			
			case 'password':
				// passwords should only be set if a value is provided
				if (!data[field.path])
					return;
				// validate matching password fields
				if (data[field.path] != data[field.paths.confirm])
					addValidationError(field.path, 'Passwords must match.');
			break;
			
			case 'email':
				if (data[field.path] && !utils.isEmail(data[field.path]))
					addValidationError(field.path, 'Please enter a valid email address in the ' + field.label + ' field.');
			break;
			
			// TODO: Ensure valid format for more field types (dates, numbers, etc)
			// TODO: This sort of validation should be passed off to the Field Class
			
		}
		
		// validate required fields.
		if (field.required && !field.validateInput(data))
			addValidationError(field.path, field.label + ' is required.');
		
		field.updateItem(this.item, data);
		
	}, this);
	
	progress();
	
}


/*!
 * Export class
 */

exports = module.exports = UpdateHandler;
