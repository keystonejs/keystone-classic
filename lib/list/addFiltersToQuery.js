function addFiltersToQuery (filters) {
	var fields = Object.keys(this.fields);
	var query = {};
	fields.forEach(function (path) {
		var field = this.fields[path];
		if (!field.addFilterToQuery || !filters[field.path]) return;
		query = field.addFilterToQuery(filters[field.path]);
	}, this);
	return query;
}

module.exports = addFiltersToQuery;
