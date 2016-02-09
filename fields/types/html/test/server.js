var demand = require('must');
var HtmlType = require('../HtmlType');

exports.initList = function (List) {
	List.add({
		html: { type: HtmlType },
		nested: {
			html: { type: HtmlType },
		},
	});
};

exports.createData = function (List) { // eslint-disable-line no-unused-vars

};

exports.testFilters = function (List) { // eslint-disable-line no-unused-vars

};

exports.testFieldType = function (List) {
	var testItem = new List.model();

	it('should update top level fields', function (done) {
		List.fields.html.updateItem(testItem, {
			html: 'foobar',
		}, function () {
			demand(testItem.html).be('foobar');
			testItem.html = undefined;
			done();
		});
	});

	it('should update nested fields', function (done) {
		List.fields['nested.html'].updateItem(testItem, {
			nested: {
				html: 'foobar',
			},
		}, function () {
			demand(testItem.nested.html).be('foobar');
			testItem.nested.html = undefined;
			done();
		});
	});

	it('should update nested fields with flat paths', function (done) {
		List.fields['nested.html'].updateItem(testItem, {
			'nested.html': 'foobar',
		}, function () {
			demand(testItem.nested.html).be('foobar');
			testItem.nested.html = undefined;
			done();
		});
	});
};
