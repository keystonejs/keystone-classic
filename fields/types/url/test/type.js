var demand = require('must');
var UrlType = require('../UrlType');
var TextType = require('../../text/TextType');

function customFormat (url) {
	return url.toUpperCase();
}

exports.initList = function (List) {
	List.add({
		url: UrlType,
		nested: {
			url: UrlType,
		},
		customFormat: { type: UrlType, format: customFormat },
	});
};

exports.testFieldType = function (List) {
	describe('updateItem', function () {
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
	});

	it('should use the common text input validator', function () {
		demand(List.fields.url.validateInput === TextType.prototype.validateInput);
	});

	it('should use the common text required validator', function () {
		demand(List.fields.url.validateRequiredInput === TextType.prototype.validateRequiredInput);
	});

	it('should use the common text addFilterToQuery method', function () {
		demand(List.fields.url.addFilterToQuery === TextType.prototype.addFilterToQuery);
	});

	describe('format', function () {
		it('should strip the protocol when formatting', function (done) {
			var testItem = new List.model();
			List.fields.url.updateItem(testItem, {
				url: 'http://www.keystonejs.com',
			}, function () {
				demand(testItem._.url.format()).be('www.keystonejs.com');
				done();
			});
		});

		it('should call custom format methods', function (done) {
			var testItem = new List.model();
			List.fields.customFormat.updateItem(testItem, {
				customFormat: 'http://www.keystonejs.com',
			}, function () {
				demand(testItem._.customFormat.format()).be('HTTP://WWW.KEYSTONEJS.COM');
				done();
			});
		});
	});
};
