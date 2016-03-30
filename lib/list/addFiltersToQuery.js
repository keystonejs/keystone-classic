var assign = require('object-assign');

function combineQueries (a, b) {
	if (a.$or && b.$or) {
		if (!a.$and) {
			a.$and = [];
		}
		a.$and.push({ $or: a.$or });
		delete a.$or;
		b.$and.push({ $or: b.$or });
		delete b.$or;
	}
	return assign(a, b);
}

function addFiltersToQuery (filters) {
	var fields = Object.keys(this.fields);
	var query = {};
	fields.forEach(function (path) {
		var field = this.fields[path];
		if (!field.addFilterToQuery || !filters[field.path]) return;
		combineQueries(query, field.addFilterToQuery(filters[field.path]));
	}, this);
	return query;
}

module.exports = addFiltersToQuery;
