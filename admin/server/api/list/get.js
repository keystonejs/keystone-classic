var async = require('async');
var assign = require('object-assign');
var listToArray = require('list-to-array');
var Mongoose = require('mongoose');
module.exports = function (req, res) {
	var where = {};
	var fields = req.query.fields;
	var includeCount = req.query.count !== 'false';
	var includeResults = req.query.results !== 'false';
	if (includeResults && fields) {
		if (fields === 'false') {
			fields = false;
		}
		if (typeof fields === 'string') {
			fields = listToArray(fields);
		}
		if (fields && !Array.isArray(fields)) {
			return res.status(401).json({ error: 'fields must be undefined, a string, or an array' });
		}
	}
	var filters = req.query.filters;
	if (filters && typeof filters === 'string') {
		try { filters = JSON.parse(req.query.filters); }
		catch (e) { } // eslint-disable-line no-empty
	}
	let priorQuery;
	if (typeof filters === 'object') {
		Object.keys(filters)
		.map(path => {
			const relationship = req.list.relationshipFields.find(relationship => relationship.path === path);
			const RefModel = req.keystone.lists[relationship.options.ref];
			if (RefModel) {
				Object.keys(RefModel.fields)
				.reduce((acc, fieldName) => {
					const field = RefModel.fields[fieldName];
					if (req.list.key === field.options.ref) {
						priorQuery = { Model: RefModel, find: toFind({ valueFilters: req.query.filters, filters: field.filters }) };
					}

				});
			}
		});
	}
	if (req.query.search) {
		assign(where, req.list.addSearchToQuery(req.query.search));
	}
	var query = req.list.model.find(where);
	if (req.query.populate) {
		query.populate(req.query.populate);
	}
	if (req.query.expandRelationshipFields && req.query.expandRelationshipFields !== 'false') {
		req.list.relationshipFields.forEach(function (i) {
			query.populate(i.path);
		});
	}
	var sort = req.list.expandSort(req.query.sort);
	async.waterfall([
		function (next) {
			if (!priorQuery) {
				return next(null);
			}
			priorQuery.Model.model.find(priorQuery.find)
			.then(results => {
				const ids = results.map(r => Mongoose.Types.ObjectId(r.id)); // return id's for $in query
				assign(where, Object.keys(req.query.filters)
				.reduce((acc, key) => {
					if (!req.query.filters[key]) return acc;
					return Object.assign({}, { [key]: { $in: ids } });
				}, {}));
				next(null);
			});
		},
		function (next) {
			if (!includeCount) {
				return next(null, 0);
			}
			query.find(where);
			query.count(next);
		},
		function (count, next) {
			if (!includeResults) {
				return next(null, count, []);
			}
			query.find(where);
			query.limit(Number(req.query.limit) || 100);
			query.skip(Number(req.query.skip) || 0);
			if (sort.string) {
				query.sort(sort.string);
			}
			query.exec(function (err, items) {
				next(err, count, items);
			});
		},
	], function (err, count, items) {
		if (err) {
			res.logError('admin/server/api/list/get', 'database error finding items', err);
			return res.apiError('database error', err);
		}

		return res.json({
			results: includeResults
				? items.map(function (item) {
					return req.list.getData(item, fields, req.query.expandRelationshipFields);
				})
				: undefined,
			count: includeCount
				? count
				: undefined,
		});
	});
};

// INPUT:
// valueFilters { domain: { value: 'bobsyouruncle.com``' }}
// OUTPUT:
// { domain: 'bobsyouruncle.com' }
function toFind ({ valueFilters, filters }) {
	return Object.keys(valueFilters)
	.reduce((acc, k) => {
		if (!filters[k]) return acc;
		const value = valueFilters[k].value;
		const key = filters[k].replace(/:/g, '');
		return Object.assign({}, acc, { [key]: value });
		// { key: 'futurism' }
	}, {});
}
