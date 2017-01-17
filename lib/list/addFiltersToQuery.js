var debug = require('debug')('keystone:core:list:addFiltersToQuery');

function addFiltersToQuery (filters, query) {
	var fields = Object.keys(this.fields);
	
	query = query || {};
	fields.forEach(function (path) {
		var field = this.fields[path];
		if (!field.addFilterToQuery || !filters[field.path]) return;
		field.addFilterToQuery(filters[field.path], query);
	}, this);
	
	debug('Adding filters to query for list \'' + list.key + '\', returned:', query);
	return query;
}

module.exports = addFiltersToQuery;
