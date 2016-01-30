var async = require('async');

function updateItem (item, data, callback) {
	async.forEach(this.fieldsArray, function(field, callback) {
		field.updateItem(item, data, callback);
	}, function() {
    item.save(callback);
  });
}

module.exports = updateItem;
