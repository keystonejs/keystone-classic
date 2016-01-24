var keystone = require('../../../../');
var async = require('async');

function getValidationError(path, msg, type) {
	return {
		name: 'ValidatorError',
		path: path,
		message: msg,
		type: type || 'required'
	};
};

module.exports = function(req, res) {
	if (!keystone.security.csrf.validate(req)) {
		console.log(`Refusing to create item; CSRF failure`);
		return res.apiError(403, 'invalid csrf');
	}
	if (req.list.get('nocreate')) {
		console.log(`Refusing to create item; List.nocreate is true`);
		return res.apiError(400, 'nocreate');
	}

	var data = req.body;
	var files = req.files;
	var item = new req.list.model();

	var validationErrors = {};
	async.forEach(req.list.fields, function(field, callback) {
		// Validate the input for each field
		field.validateInput(data, field.required, item,
			function(err, isValid) {
				if (!isValid) {
					// Create object of validation errors
					var errorMessage = "Error: invalid input for " + field.label;
					var errorObject = getValidationError(field.path, errorMessage);
					validationErrors[field.path] = errorObject;
				}
				callback();
		});
	}, function(err) {
		if (Object.keys(validationErrors).length > 0) {
			// There were validation errors
			res.status(500).json({
				err: 'validation error',
				detail: {
					errors: validationErrors,
				},
			});
		} else {
			// There were no validation errors, create the new item
			req.list.updateItem(item, {
				data: data,
				files: files,
			}, function (err) {
				if (err) return res.status(500).json({ err: 'database error', detail: err });
				res.json(req.list.getData(item));
			});
		}
	});
};
