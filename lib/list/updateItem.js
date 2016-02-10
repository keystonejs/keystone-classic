var async = require('async');

function updateItem (item, options, callback) {
	var data = options.data || {};
	async.forEach(this.fieldsArray, function (field, callback) {
		field.updateItem(item, options.data, callback);
	}, function () {
		item.save(callback);
	});
}

module.exports = updateItem;
