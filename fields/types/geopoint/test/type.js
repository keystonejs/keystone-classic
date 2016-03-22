var demand = require('must');
var GeoPointType = require('../GeoPointType');

exports.initList = function (List) {
	List.add({
		geo: { type: GeoPointType },
		nested: {
			geo: { type: GeoPointType },
		},
	});
};

exports.testFieldType = function (List) {
	var testItem = new List.model();

	it('should update top level fields', function (done) {
		List.fields.geo.updateItem(testItem, {
			geo: [1, 2],
		}, function () {
			demand(testItem.geo).eql([1, 2]);
			testItem.geo = undefined;
			done();
		});
	});

	it('should update nested fields', function (done) {
		List.fields['nested.geo'].updateItem(testItem, {
			nested: {
				geo: [1, 2],
			},
		}, function () {
			demand(testItem.nested.geo).eql([1, 2]);
			testItem.nested.geo = undefined;
			done();
		});
	});

	it('should update nested fields with flat paths', function (done) {
		List.fields['nested.geo'].updateItem(testItem, {
			'nested.geo': [1, 2],
		}, function () {
			demand(testItem.nested.geo).eql([1, 2]);
			testItem.nested.geo = undefined;
			done();
		});
	});
};
