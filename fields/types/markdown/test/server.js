var demand = require('must'),
	MarkdownType = require('../MarkdownType');

exports.initList = function(List) {
	List.add({
		markdown: { type: MarkdownType },
		nested: {
			markdown: { type: MarkdownType }
		}
	});
};

exports.createData = function(List) {// eslint-disable-line no-unused-vars

};

exports.testFilters = function(List) {// eslint-disable-line no-unused-vars

};

exports.testFieldType = function(List) {
	var testItem = new List.model();

	it('should update top level fields', function() {
		List.fields.markdown.updateItem(testItem, {
			markdown: 'foobar'
		});
		demand(testItem.markdown.html).be('<p>foobar</p>\n');
		testItem.markdown = undefined;
	});
	
	it('should update nested fields', function() {
		List.fields['nested.markdown'].updateItem(testItem, {
			nested: {
				markdown: 'foobar'
			}
		});
		demand(testItem.nested.markdown.html).be('<p>foobar</p>\n');
		testItem.nested.markdown = undefined;
	});
	
	it('should update nested fields with flat paths', function() {
		List.fields['nested.markdown'].updateItem(testItem, {
			'nested.markdown': 'foobar'
		});
		demand(testItem.nested.markdown.html).be('<p>foobar</p>\n');
		testItem.nested.markdown = undefined;
	});
};
