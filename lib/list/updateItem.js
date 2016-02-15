var async = require('async');

function updateItem (item, data, options, callback) {
	if (typeof options === 'function') {
		callback = options;
		options = {};
	}
	async.forEach(this.fieldsArray, function (field, callback) {
		field.updateItem(item, data, callback);
	}, function () {
		item.save(callback);
	});
}

module.exports = updateItem;
