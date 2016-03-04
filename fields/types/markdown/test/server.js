var demand = require('must');
var MarkdownType = require('../MarkdownType');
var validators = require('../../validators');
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
	var testItem = new List.model();

	it('should update top level fields', function (done) {
		List.fields.markdown.updateItem(testItem, {
			markdown: 'foobar',
		}, function () {
			demand(testItem.markdown.html).be('<p>foobar</p>\n');
			testItem.markdown = undefined;
			done();
		});
	});

	it('should update nested fields', function (done) {
		List.fields['nested.markdown'].updateItem(testItem, {
			nested: {
				markdown: 'foobar',
			},
		}, function () {
			demand(testItem.nested.markdown.html).be('<p>foobar</p>\n');
			testItem.nested.markdown = undefined;
			done();
		});
	});

	it('should update nested fields with flat paths', function (done) {
		List.fields['nested.markdown'].updateItem(testItem, {
			'nested.markdown': 'foobar',
		}, function () {
			demand(testItem.nested.markdown.html).be('<p>foobar</p>\n');
			testItem.nested.markdown = undefined;
			done();
		});
	});

	it('should use the common markdown input validator', function () {
		demand(List.fields.markdown.validateInput === validators.text.input);
	});

	it('should use the common markdown required validator', function () {
		demand(List.fields.markdown.validateRequiredInput === validators.text.required);
	});
};
