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
			field.updateItem(item, data, function (err) {
				if (err) {
					updateErrors[field.path] = err;
				}
				complete();
			});
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
