function updateItem (item, options, callback) {
	var data = options.data || {};
	this.fieldsArray.forEach(function(field) {
		field.updateItem(item, options.data);
	});
	item.save(callback);
}

module.exports = updateItem;
