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

exports.createData = function (List) { // eslint-disable-line no-unused-vars

};

exports.testFilters = function (List) { // eslint-disable-line no-unused-vars

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

	it('should use the common markdown input validator', function () {
		demand(List.fields.markdown.validateInput === TextType.prototype.validateInput);
	});

	it('should use the common markdown required validator', function () {
		demand(List.fields.markdown.validateRequiredInput === TextType.prototype.validateRequiredInput);
	});
};
