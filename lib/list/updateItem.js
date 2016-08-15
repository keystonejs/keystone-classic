var async = require('async');
var listToArray = require('list-to-array');

var evalDependsOn = require('../../fields/utils/evalDependsOn.js');

function addValidationError (errors, path, type, detail) {
	if (detail instanceof Error) {
		detail = detail.name !== 'Error' ? detail.name + ': ' + detail.message : detail.message;
	}
	errors[path] = {
		type: type,
		error: typeof detail === 'string' ? detail : path + ' is ' + type,
		detail: typeof detail === 'object' ? detail : undefined,
	};
};

function updateItem (item, data, options, callback) {
	/* Process arguments and options */
	if (typeof options === 'function') {
		callback = options;
		options = {};
	}
	// fields defaults to all the fields in the list
	var fields = options.fields || this.fieldsArray;
	// fields can be a list or array of field paths or Field instances
	fields = listToArray(fields).map(function (field) {
		// TODO: Check that field is an instance of Field
		return (typeof field === 'string') ? this.fields[field] : field;
	}, this);
	// check for invalid fields
	if (fields.indexOf(undefined) >= 0) {
		return callback({
			error: 'invalid configuration',
			detail: 'Invalid path specified in fields to update [' + options.fields + '] for list ' + this.key,
		});
	}
	async.series([
		/* Process validation */
		function (passedValidation) {
			var validationErrors = {};
			// Note; we don't pass back validation errors to the callback, because we don't
			// want to break the async loop before all the fields have been validated.
			async.each(fields, function (field, next) {
				field.validateInput(data, function (valid, detail) {
					if (!valid) {
						addValidationError(validationErrors, field.path, 'invalid', detail);
						next();
					} else {
						if (field.required && (!field.dependsOn || evalDependsOn(field.dependsOn, data))) {
							field.validateRequiredInput(item, data, function (valid, detail) {
								if (!valid) {
									addValidationError(validationErrors, field.path, 'required', detail);
								}
								next();
							});
						} else {
							next();
						}
					}
				});
			}, function () {
				if (Object.keys(validationErrors).length) {
					return callback({
						error: 'validation errors',
						detail: validationErrors,
					});
				}
				passedValidation();
			});
		},
		/* Apply updates to fields */
		function (doneUpdate) {
			var updateErrors = {};
			async.each(fields, function (field, next) {
				// all fields have (item, data) as the first two arguments
				var updateArgs = [item, data];
				// some fields support an optional third argument: files
				if (field.updateItem.length > 3) {
					updateArgs.push(options.files);
				}
				// callback is always the last argument
				updateArgs.push(function (err) {
					if (err) updateErrors[field.path] = err;
					next();
				});
				// call field.updateItem with the arguments
				field.updateItem.apply(field, updateArgs);
			}, function () {
				// Note; we don't pass back errors to the callback, because we don't want
				// to break the async loop before all the fields have been updated.
				if (Object.keys(updateErrors).length) {
					return callback({
						error: 'field errors',
						detail: updateErrors,
					});
				}
				item.save(doneUpdate);
			});
		},
	],
	/* Done */
	function (err) {
		if (err) {
			return callback({
				error: 'database error',
				detail: err,
			});
		}
		return callback();
	});
}

module.exports = updateItem;
