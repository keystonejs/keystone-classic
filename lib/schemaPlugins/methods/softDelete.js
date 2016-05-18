module.exports = function softDelete (userId, callback) {
	var item = this;

	if (typeof callback !== 'function') {
		throw new Error('List.softDelete(callback) requires a callback function.');
	}

	item.deletedBy = userId;
	item.deletedAt = new Date();
	item.save(callback);
};
