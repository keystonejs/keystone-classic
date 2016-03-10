var demand = require('must');
var UrlType = require('../UrlType');
var validators = require('../../validators');

exports.initList = function (List) {
	List.add({
		url: UrlType,
		nested: {
			url: UrlType,
		},
	});
};

exports.testFieldType = function (List) {
	it('should update top level fields', function (done) {
		var testItem = new List.model();
		List.fields.url.updateItem(testItem, {
			url: 'value',
		}, function () {
			demand(testItem.url).be('value');
			done();
		});
	});

	it('should update nested fields', function (done) {
		var testItem = new List.model();
		List.fields['nested.url'].updateItem(testItem, {
			nested: {
				url: 'value',
			},
		}, function () {
			demand(testItem.nested.url).be('value');
			done();
		});
	});

	it('should update nested fields with flat paths', function (done) {
		var testItem = new List.model();
		List.fields['nested.url'].updateItem(testItem, {
			'nested.url': 'value',
		}, function () {
			demand(testItem.nested.url).be('value');
			done();
		});
	});

	it('should strip the protocol when formatting', function (done) {
		var testItem = new List.model();
		List.fields.url.updateItem(testItem, {
			url: 'http://www.keystonejs.com',
		}, function () {
			demand(testItem._.url.format()).be('www.keystonejs.com');
			done();
		});
	});

	it('should use the common url input validator', function () {
		demand(List.fields.url.validateInput === validators.text.input);
	});

	it('should use the common url required validator', function () {
		demand(List.fields.url.validateRequiredInput === validators.text.required);
	});
};
