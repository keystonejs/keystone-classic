var demand = require('must');
var MarkdownType = require('../MarkdownType');
var TextType = require('../../text/TextType');

exports.initList = function (List) {
	List.add({
		markdown: { type: MarkdownType },
		nested: {
			markdown: { type: MarkdownType },
		},
	});
};

exports.testFieldType = function (List) {
	describe('updateItem', function () {
		it('should update top level fields', function (done) {
			var testItem = new List.model();
			List.fields.markdown.updateItem(testItem, {
				markdown: 'foobar',
			}, function () {
				demand(testItem.markdown.html).be('<p>foobar</p>\n');
				done();
			});
		});

		it('should update nested fields', function (done) {
			var testItem = new List.model();
			List.fields['nested.markdown'].updateItem(testItem, {
				nested: {
					markdown: 'foobar',
				},
			}, function () {
				demand(testItem.nested.markdown.html).be('<p>foobar</p>\n');
				done();
			});
		});

		it('should update nested fields with flat paths', function (done) {
			var testItem = new List.model();
			List.fields['nested.markdown'].updateItem(testItem, {
				'nested.markdown': 'foobar',
			}, function () {
				demand(testItem.nested.markdown.html).be('<p>foobar</p>\n');
				done();
			});
		});
	});

	it('should use the common text input validator', function () {
		demand(List.fields.markdown.validateInput === TextType.prototype.validateInput);
	});

	it('should use the common text required validator', function () {
		demand(List.fields.markdown.validateRequiredInput === TextType.prototype.validateRequiredInput);
	});

	describe('addFilterToQuery', function () {
		it('should return a regex with the "i" flag set', function () {
			var result = List.fields.markdown.addFilterToQuery({
				value: 'abc',
			});
			demand(result['markdown.md']).eql(/abc/i);
		});

		it('should allow case sensitive matching', function () {
			var result = List.fields.markdown.addFilterToQuery({
				value: 'abc',
				caseSensitive: true,
			});
			demand(result['markdown.md']).eql(/abc/);
		});

		it('should allow inverted matching', function () {
			var result = List.fields.markdown.addFilterToQuery({
				value: 'abc',
				inverted: true,
			});
			demand(result['markdown.md']).eql({
				$not: /abc/i,
			});
		});

		it('should allow exact matching', function () {
			var result = List.fields.markdown.addFilterToQuery({
				value: 'abc',
				mode: 'exactly',
			});
			demand(result['markdown.md']).eql(/^abc$/i);
		});

		it('should allow matching the end', function () {
			var result = List.fields.markdown.addFilterToQuery({
				value: 'abc',
				mode: 'endsWith',
			});
			demand(result['markdown.md']).eql(/abc$/i);
		});

		it('should allow matching the start', function () {
			var result = List.fields.markdown.addFilterToQuery({
				value: 'abc',
				mode: 'beginsWith',
			});
			demand(result['markdown.md']).eql(/^abc/i);
		});

		it('should allow matching empty values in exact mode', function () {
			var result = List.fields.markdown.addFilterToQuery({
				mode: 'exactly',
			});
			demand(result['markdown.md']).eql({
				$in: ['', null],
			});
		});

		it('should allow matching non-empty values in exact mode with the inverted option', function () {
			var result = List.fields.markdown.addFilterToQuery({
				mode: 'exactly',
				inverted: true,
			});
			demand(result['markdown.md']).eql({
				$nin: ['', null],
			});
		});
	});
};
