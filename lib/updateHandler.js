var _ = require('lodash');
var assign = require('object-assign');

// NOTE: the old signature was UpdateHandler (list, item, req, res, options)
// the `res` argument has been deprecated, but we still detect and handle it
function UpdateHandler (list, item, req, options) {
	this.list = list;
	this.item = item;
	this.req = req;
	if (arguments.length === 5) {
		// old signature; set options to the last argument
		options = arguments[4];
	}
	this.options = options || {};
}

/*
Options:

(passed to List.updateItem)
options.fields: list or array of fields to process
options.files: files object for processing uploads, defaults to req.files
options.required: list or array or object of keys: true | false
options.user: the user to provide for item tracking, defaults to req.user

(UpdateHandler specific)
options.flashErrors: whether to put error messages in req.flash
options.errorMessage: string, error message to display w/ req.flash
options.invalidMessages: object of keys: message to display for invalid fields
options.requiredMessages: object of keys: message to display for required fields
*/

/*
TODO:
We could allow a custom function for formatting errors that are put in
req.flash, because most use-cases will be covered by the generic handling
but it's an "all or none" proposition at the moment
*/

UpdateHandler.prototype.process = function (data, options, callback) {

	var item = this.item;
	var list = this.list;
	var req = this.req;
	options = assign({}, this.options, options);

	// pass the user from the request by default
	if (!options.user) {
		options.user = this.req.user;
	}

	// pass the uploaded files object from the request by default
	if (!options.files) {
		options.files = this.req.files;
	}

	function flashErrors (err) {
		var errorMessage = options.errorMessage || 'There was a problem saving your changes';
		// Detect Keystone validation errors
		if (err.error === 'validation errors') {
			if (options.flashErrors === true || options.flashErrors === 'validation') {
				req.flash('error', {
					type: 'ValidationError',
					title: errorMessage + ':',
					// TODO: Apply custom invalidMessages / requiredMessages
					list: _.map(err.detail, 'error'),
				});
			}
		}
		// Detect Mongoose validation errors
		else if (err.name === 'ValidationError') {
			if (options.flashErrors === true || options.flashErrors === 'validation') {
				req.flash('error', {
					type: 'ValidationError',
					title: errorMessage + ':',
					list: _.map(err.errors, 'message'),
				});
			}
		}
		// Detect Keystone field update errors
		if (err.error === 'field errors') {
			if (options.flashErrors === true || options.flashErrors === 'update') {
				req.flash('error', {
					type: 'UpdateError',
					title: errorMessage + ':',
					list: _.map(err.detail, 'error'),
				});
			}
		}
		// Fallback
		else {
			if (options.flashErrors === true || options.flashErrors === 'update') {
				var msg = errorMessage;
				if (typeof err.error === 'string') msg += ': ' + err.error;
				if (typeof err.detail === 'string') msg += ': ' + err.detail;
				this.req.flash('error', msg);
			}
		}
	}

	this.list.updateItem(this.item, data, options, function (err) {
		if (err) {
			if (options.logErrors) {
				console.log('Error saving changes to ' + list.singular + ' ' + item.id + ':', err);
			}
			if (options.flashErrors) {
				flashErrors(err);
			}
		}
		callback(err);
	});

};

module.exports = UpdateHandler;
