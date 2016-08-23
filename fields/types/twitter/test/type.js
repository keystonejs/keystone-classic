var demand = require('must');
var TwitterType = require('../TwitterType');
var TextType = require('../../text/TextType');

// function customFormat (url) {
// 	return url.toUpperCase();
// }

exports.initList = function (List) {
	List.add({
		twitter: TwitterType,
		nested: {
			twitter: TwitterType,
		},
		// customFormat: { type: UrlType, format: customFormat },
	});
};

exports.testFieldType = function (List) {
	describe('updateItem', function () {
		it('should update top level fields', function (done) {
			var testItem = new List.model();
			List.fields.twitter.updateItem(testItem, {
				twitter: 'value',
			}, function () {
				demand(testItem.twitter).be('value');
				done();
			});
		});

		it('should update nested fields', function (done) {
			var testItem = new List.model();
			List.fields['nested.twitter'].updateItem(testItem, {
				nested: {
					twitter: 'value',
				},
			}, function () {
				demand(testItem.nested.twitter).be('value');
				done();
			});
		});

		it('should update nested fields with flat paths', function (done) {
			var testItem = new List.model();
			List.fields['nested.twitter'].updateItem(testItem, {
				'nested.twitter': 'value',
			}, function () {
				demand(testItem.nested.twitter).be('value');
				done();
			});
		});
	});

	it('should use the common text input validator', function () {
		demand(List.fields.twitter.validateInput === TextType.prototype.validateInput);
	});

	it('should use the common text required validator', function () {
		demand(List.fields.twitter.validateRequiredInput === TextType.prototype.validateRequiredInput);
	});

	it('should use the common text addFilterToQuery method', function () {
		demand(List.fields.twitter.addFilterToQuery === TextType.prototype.addFilterToQuery);
	});

	describe('format', function () {
		it('should strip the protocol when formatting', function (done) {
			var testItem = new List.model();
			List.fields.twitter.updateItem(testItem, {
				url: 'http://www.keystonejs.com',
			}, function () {
				demand(testItem._.twitter.format()).be('www.keystonejs.com');
				done();
			});
		});

		// it('should call custom format methods', function (done) {
		// 	var testItem = new List.model();
		// 	List.fields.customFormat.updateItem(testItem, {
		// 		customFormat: 'http://www.keystonejs.com',
		// 	}, function () {
		// 		demand(testItem._.customFormat.format()).be('HTTP://WWW.KEYSTONEJS.COM');
		// 		done();
		// 	});
		// });
	});
};
