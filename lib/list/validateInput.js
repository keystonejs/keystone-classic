var evalDependsOn = require('../../fields/utils/evalDependsOn.js');

function validateInput (item, data, callback) {
	var fieldCount = this.fieldsArray.length;
	var fieldsUpdated = 0;
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
	if (this.fieldsArray.length) {
		this.fieldsArray.forEach(function (field) {
			field.validateInput(data, function (valid, detail) {
				if (!valid) {
					addValidationError(field.path, 'invalid', detail);
					complete();
				} else {
					if (field.required && (!field.dependsOn || evalDependsOn(field.dependsOn, data))) {
						field.validateRequiredInput(item, data, function (valid, detail) {
							if (!valid) {
								addValidationError(field.path, 'required', detail);
							}
							complete();
						});
					} else {
						complete();
					}
				}
			});
		});
	} else {
		complete();
	}
	function complete () {
		if (++fieldsUpdated < fieldCount) return;
		if (Object.keys(validationErrors).length) {
			return callback({
				error: 'validation errors',
				detail: validationErrors,
			});
		}
		return callback();
	}
}

module.exports = validateInput;
