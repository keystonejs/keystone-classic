module.exports = function(req, res) {
	var where = {};
	var filters = req.query.filters;
	if (filters && typeof filters === 'string') {
		try { filters = JSON.parse(req.query.filters); }
		catch(e) { } // eslint-disable-line no-empty
	}
	if (typeof filters === 'object') {
		req.list.addFiltersToQuery(filters, where);
	}
	if (req.query.search) {
		req.list.addSearchToQuery(req.query.search, where);
	}
	var query = req.list.model.find(where);
	if (req.query.populate) {
		query.populate(req.query.populate);
	}
	if (req.query.expandRelationshipFields) {
		req.list.relationshipFields.forEach(function(i) {
			query.populate(i.path);
		});
	}
	var sort = req.list.expandSort(req.query.sort);
	query.sort(sort.string);
	query.exec(function(err, results) {
		if (err) return res.apiError('database error', err);
		var data = results.map(function (item) {
			return req.list.getData(item, req.query.select, req.query.expandRelationshipFields);
		});
		return res.json(data);
	});
};
