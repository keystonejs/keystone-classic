var _ = require('lodash');
var fs = require('fs');
var keystone = require('../../index.js');
var path = require('path');

keystone.init();

var typesLoc = path.resolve('fields/types');
var types = fs.readdirSync(typesLoc);

types.forEach(function (name) {
	var filtersTestPath = typesLoc + '/' + name + '/test/filters.js';
	if (!fs.existsSync(filtersTestPath)) return;

	var listKey = name + 'FiltersTest';

	// nocreate option prevents warnings for required / not initial fields
	var List = keystone.List(listKey, { nocreate: true });
	var test = require(filtersTestPath);

	test.initList(List);
	List.register();

	var filter = function (filters, prop, callback) {
		if (typeof prop === 'function') {
			callback = prop;
			prop = null;
		}
		var where = List.addFiltersToQuery(filters);
		List.model.find(where, function (err, results) {
			results = prop ? _.map(results, prop) : results;
			callback(results);
		});
	}

	describe('FieldType: ' + name.substr(0,1).toUpperCase() + name.substr(1) + ': Filter', function () {
		before(function (done) {
			List.model.remove().exec(function (err) {
				if (err) throw err;
				var testItems = {};
				if (test.getTestItems.length < 2) {
					testItems[listKey] = test.getTestItems(List);
					return keystone.createItems(testItems, done);
				} else {
					test.getTestItems(List, function (err, data) {
						if (err) throw err;
						testItems[listKey] = data;
						keystone.createItems(testItems, done);
					});
				}
			});
		});
		test.testFilters(List, filter);
	});
});
