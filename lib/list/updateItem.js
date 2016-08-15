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

	// you can optionally require fields that aren't required in the schema
	// note that if fields are required in the schema, they will always be checked
	//
	// this option supports the backwards compatible { path: true } format, or a
	// list or array of field paths to validate
	var requiredFields = options.required;
	var requiredFieldPaths = options.required || {};
	if (typeof requiredFields === 'string') {
		requiredFields = listToArray(requiredFields);
	}
	if (Array.isArray(requiredFields)) {
		requiredFields.forEach(function (path) {
			requiredFieldPaths[path] = true;
		});
	}

	/* Field Validation */
	var validationErrors = {};
	function doFieldValidation (field, done) {
		// Note; we don't pass back validation errors to the callback, because we don't
		// want to break the async loop before all the fields have been validated.
		field.validateInput(data, function (valid, detail) {
			if (!valid) {
				addValidationError(validationErrors, field.path, 'invalid', detail);
				done();
			} else {
				if ((field.required || requiredFieldPaths[field.path])
					&& (!field.dependsOn || evalDependsOn(field.dependsOn, data)))
				{
					field.validateRequiredInput(item, data, function (valid, detail) {
						if (!valid) {
							addValidationError(validationErrors, field.path, 'required', detail);
						}
						done();
					});
				} else {
					done();
				}
			}
		});
	}

	/* Field Updates */
	var updateErrors = {};
	function doFieldUpdate (field, done) {
		// all fields have (item, data) as the first two arguments
		var updateArgs = [item, data];
		// some fields support an optional third argument: files
		if (field.updateItem.length > 3) {
			updateArgs.push(options.files);
		}
		// callback is always the last argument
		updateArgs.push(function (err) {
			// Note; we don't pass back errors to the callback, because we don't want
			// to break the async loop before all the fields have been updated.
			if (err) updateErrors[field.path] = err;
			done();
		});
		// call field.updateItem with the arguments
		field.updateItem.apply(field, updateArgs);
	}

	/* Flow control */
	async.series([
		/* Process validation */
		function (passedValidation) {
			async.each(fields, doFieldValidation, function () {
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
			async.each(fields, doFieldUpdate, function () {
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
