var async = require('async');

function updateItem (item, data, options, callback) {
	if (typeof options === 'function') {
		callback = options;
		options = {};
	}
	var updateErrors = {};
	async.each(this.fieldsArray, function (field, next) {
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
		// note custom error handling; we don't pass the error to the callback
		// because it would stop async from processing all the fields
		if (Object.keys(updateErrors).length) {
			return callback({
				error: 'field errors',
				detail: updateErrors,
			});
		}
		item.save(function (err) {
			if (err) {
				return callback({
					error: 'database error',
					detail: err,
				});
			}
			return callback();
		});
	});
}

module.exports = updateItem;
