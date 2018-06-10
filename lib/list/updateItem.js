var async = require('async');
var listToArray = require('list-to-array');

var evalDependsOn = require('../../fields/utils/evalDependsOn.js');

var MONGO_INDEX_CONSTRAINT_ERROR_REGEXP = /E11000 duplicate key error index\: [^\$]+\$(\w+) dup key\: \{ \: "([^"]+)" \}/;

// Adds a validation message to the errors object in the common format
function addValidationError (options, errors, field, type, detail) {
	if (detail instanceof Error) {
		detail = detail.name !== 'Error' ? detail.name + ': ' + detail.message : detail.message;
	}
	var error = '';
	if (typeof detail === 'string') {
		error = detail;
	} else {
		if (type === 'required' && options.requiredMessages && options.requiredMessages[field.path]) {
			error = options.requiredMessages[field.path];
		} else if (type === 'invalid' && options.invalidMessages && options.invalidMessages[field.path]) {
			error = options.invalidMessages[field.path];
		} else {
			error = field.path.substr(0, 1).toUpperCase() + field.path.substr(1) + ' is ' + type;
		}
	}
	errors[field.path] = {
		type: type,
		error: error,
		detail: typeof detail === 'object' ? detail : undefined,
		fieldLabel: field.label,
		fieldType: field.type,
	};
};

// Adds a field update error message to the errors object in the common format
function addFieldUpdateError (errors, field, detail) {
	if (detail instanceof Error) {
		detail = detail.name !== 'Error' ? detail.name + ': ' + detail.message : detail.message;
	}
	errors[field.path] = {
		error: typeof detail === 'string' ? detail : field.path + ' error',
		detail: typeof detail === 'object' ? detail : undefined,
		fieldLabel: field.label,
		fieldType: field.type,
	};
}

function updateItem (item, data, options, callback) {
	/* Process arguments and options */
	if (typeof options === 'function') {
		callback = options;
		options = {};
	}
	if (!options) {
		options = {};
	}

	// update fields with noedit: true set if fields have been explicitly
	// provided, or if the ignoreNoEdit option is true
	var ignoreNoEdit = !!(options.fields || options.ignoreNoEdit);

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

	// Strip out noedit fields
	if (!ignoreNoEdit) {
		fields = fields.filter(function (i) {
			return !i.noedit;
		});
	}

	// you can optionally require fields that aren't required in the schema
	// note that if fields are required in the schema, they will always be checked
	//
	// this option supports the backwards compatible { path: true } format, or a
	// list or array of field paths to validate
	var requiredFields = options.required;
	var requiredFieldPaths = {};
	if (typeof requiredFields === 'string') {
		requiredFields = listToArray(requiredFields);
	}
	if (Array.isArray(requiredFields)) {
		requiredFields.forEach(function (path) {
			requiredFieldPaths[path] = true;
		});
	} else if (typeof requiredFields === 'object') {
		requiredFieldPaths = requiredFields;
	}

	/* Field Validation */
	// TODO: If a field is required but not specified in the provided fields array
	// we should explicitly include it in the set of fields to validate
	var validationErrors = {};
	function doFieldValidation (field, done) {
		// Note; we don't pass back validation errors to the callback, because we don't
		// want to break the async loop before all the fields have been validated.
		field.validateInput(data, function (valid, detail) {
			if (!valid) {
				addValidationError(options, validationErrors, field, 'invalid', detail);
				done();
			} else {
				if ((field.required || requiredFieldPaths[field.path])
					&& (!field.dependsOn || evalDependsOn(field.dependsOn, data)))
				{
					field.validateRequiredInput(item, data, function (valid, detail) {
						if (!valid) {
							addValidationError(options, validationErrors, field, 'required', detail);
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
		var callback = function (err) {
			// Note; we don't pass back errors to the callback, because we don't want
			// to break the async loop before all the fields have been updated.
			if (err) {
				addFieldUpdateError(updateErrors, field, err);
			}
			done();
		};
		// all fields have (item, data) as the first two arguments
		var updateArgs = [item, data];
		// some fields support an optional third argument: files
		if (field.updateItem.length > 3) {
			updateArgs.push(options.files);
		}
		// callback is always the last argument
		updateArgs.push(callback);
		// call field.updateItem with the arguments
		field.updateItem.apply(field, updateArgs);
	}

	/* Track plugin support */
	// If the track plugin is enabled for the list, it looks for ._req_user to
	// detect the user that performed the updated. Default it to the user
	// specified in the options.
	if (options.user) {
		item._req_user = options.user;
	}

	/* Flow control */
	async.series([
		/* Process validation */
		function (doneValidation) {
			async.each(fields, doFieldValidation, function () {
				if (Object.keys(validationErrors).length) {
					return doneValidation({
						error: 'validation errors',
						detail: validationErrors,
					});
				}
				doneValidation();
			});
		},
		/* Apply updates to fields */
		function (doneUpdate) {
			async.each(fields, doFieldUpdate, function () {
				if (Object.keys(updateErrors).length) {
					return doneUpdate({
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
			if (err instanceof Error) {
				// Try to make mongoose index constraint errors more friendly
				// This is brittle, but should return a more human-readable error message
				if (err.code === 11000) {
					var indexConstraintError = MONGO_INDEX_CONSTRAINT_ERROR_REGEXP.exec(err.errmsg);
					if (indexConstraintError) {
						var probableFieldPath = indexConstraintError[1];
						probableFieldPath = probableFieldPath.substr(0, probableFieldPath.lastIndexOf('_'));
						return callback({
							error: 'database error',
							detail: 'Duplicate ' + probableFieldPath + ' value "' + indexConstraintError[2] + '" already exists',
						});
					}
				}
				// Wrap Error objects in the standard format, they're most likely
				// a database error (not sure if we can make this more specific?)
				return callback({
					error: 'database error',
					detail: err,
				});
			} else {
				// Return other error object directly
				return callback(err);
			}
		}
		return callback();
	});
}

module.exports = updateItem;
