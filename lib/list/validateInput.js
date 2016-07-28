var async = require('async');
var listToArray = require('list-to-array');

var evalDependsOn = require('../../fields/utils/evalDependsOn.js');

function validateInput (item, data, options, callback) {
	if (typeof options === 'function') {
		callback = options;
		options = {};
	}
	var fields = options.fields || this.fieldsArray;
	if (typeof fields === 'string') {
		fields = listToArray(fields).map(function (path) {
			return this.fields[path];
		}, this);
		if (fields.indexOf(undefined) >= 0) {
			return callback({
				error: 'invalid configuration',
				detail: 'Invalid path specified in set to validate [' + options.fields + '] for list ' + this.key,
			});
		}
	}
	var validationErrors = {};
	function addValidationError (path, type, detail) {
		if (detail instanceof Error) {
			detail = detail.name !== 'Error' ? detail.name + ': ' + detail.message : detail.message;
		}
		validationErrors[path] = {
			type: type,
			error: typeof detail === 'string' ? detail : path + ' is ' + type,
			detail: typeof detail === 'object' ? detail : undefined,
		};
	};
	// Note; we don't pass back validation errors to the callback, because we don't
	// want to break the async loop before all the fields have been validated.
	async.each(fields, function (field, next) {
		field.validateInput(data, function (valid, detail) {
			if (!valid) {
				addValidationError(field.path, 'invalid', detail);
				next();
			} else {
				if (field.required && (!field.dependsOn || evalDependsOn(field.dependsOn, data))) {
					field.validateRequiredInput(item, data, function (valid, detail) {
						if (!valid) {
							addValidationError(field.path, 'required', detail);
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
		return callback();
	});
}

module.exports = validateInput;
