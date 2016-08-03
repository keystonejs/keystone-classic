function updateItem (item, data, options, callback) {
	if (typeof options === 'function') {
		callback = options;
		options = {};
	}
	var fieldCount = this.fieldsArray.length;
	var fieldsUpdated = 0;
	var updateErrors = {};
	if (this.fieldsArray.length) {
		this.fieldsArray.forEach(function (field) {
			// all fields have (item, data) as the first two arguments
			var updateArgs = [item, data];
			// some fields support an optional third argument: files
			if (field.updateItem.length > 3) {
				updateArgs.push(options.files);
			}
			// callback is always the last argument
			updateArgs.push(function (err) {
				if (err) {
					updateErrors[field.path] = err;
				}
				complete();
			});
			// call field.updateItem with the arguments
			field.updateItem.apply(field, updateArgs);
		});
	} else {
		complete();
	}
	function complete () {
		if (++fieldsUpdated < fieldCount) return;
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
	}
}

module.exports = updateItem;
