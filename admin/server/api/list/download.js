var baby = require('babyparse');
var keystone = require('../../../../');
var moment = require('moment');

module.exports = function (req, res) {
	var format = req.params.format.split('.')[1]; // json or csv
	var where = {};
	var filters = req.query.filters;
	if (filters && typeof filters === 'string') {
		try { filters = JSON.parse(req.query.filters); }
		catch (e) { } // eslint-disable-line no-empty
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
		req.list.relationshipFields.forEach(function (i) {
			query.populate(i.path);
		});
	}
	var sort = req.list.expandSort(req.query.sort);
	query.sort(sort.string);
	query.exec(function (err, results) {
		var data;
		if (err) return res.apiError('database error', err);
		if (format === 'csv') {
			data = results.map(function (item) {
				return req.list.getCSV(item, req.query.select, req.query.expandRelationshipFields);
			});
			res.attachment(req.list.path + '-' + moment().format('YYYYMMDD-HHMMSS') + '.csv');
			res.setHeader('Content-Type', 'application/octet-stream');
			var content = baby.unparse(data, {
				delimiter: keystone.get('csv field delimiter') || ',',
			});
			res.end(content, 'utf-8');
		} else {
			data = results.map(function (item) {
				return req.list.getCSV(item, req.query.select, req.query.expandRelationshipFields);
			});
			res.json(data);
		}
	});
};
