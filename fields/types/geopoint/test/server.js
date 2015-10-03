var demand = require('must'),
	GeoPointType = require('../GeoPointType');

exports.initList = function(List) {
	List.add({
		geo: { type: GeoPointType },
		nested: {
			geo: { type: GeoPointType }
		}
	});
};

exports.createData = function(List) {//eslint-disable-line no-unused-vars

};

exports.testFilters = function(List) {//eslint-disable-line no-unused-vars

};

exports.testFieldType = function(List) {
	var testItem = new List.model();

	it('should update top level fields', function() {
		List.fields.geo.updateItem(testItem, {
			geo: [1, 2]
		});
		demand(testItem.geo).eql([1, 2]);
		testItem.geo = undefined;
	});
	
	it('should update nested fields', function() {
		List.fields['nested.geo'].updateItem(testItem, {
			nested: {
				geo: [1, 2]
			}
		});
		demand(testItem.nested.geo).eql([1, 2]);
		testItem.nested.geo = undefined;
	});
	
	it('should update nested fields with flat paths', function() {
		List.fields['nested.geo'].updateItem(testItem, {
			'nested.geo': [1, 2]
		});
		demand(testItem.nested.geo).eql([1, 2]);
		testItem.nested.geo = undefined;
	});
};
