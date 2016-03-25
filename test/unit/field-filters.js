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

	var testItems = {};
	testItems[listKey] = test.getTestItems();

	describe('FieldType: ' + name.substr(0,1).toUpperCase() + name.substr(1) + ': Filter', function () {
		before(function (done) {
			List.model.remove().exec(function (err) {
				if (err) throw err;
				keystone.createItems(testItems, done);
			});
		});
		test.testFilters(List);
	});
});
