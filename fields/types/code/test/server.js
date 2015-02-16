var assert = require('assert'),
	demand = require('must'),
	UpdateHandler = require('../../../../lib/updateHandler'),
	CodeType = require('../CodeType');

exports.initList = function(List) {
	List.add({
		code: { type: CodeType },
		nested: {
			code: { type: CodeType }
		}
	});
};

exports.createData = function(List) {

};

exports.testFilters = function(List) {

};

exports.testFieldType = function(List) {
	var testItem = new List.model();

	it('should update top level fields', function() {
		List.fields.code.updateItem(testItem, {
			code: 'foo(bar);'
		});
		demand(testItem.code).be('foo(bar);');
		testItem.code = undefined;
	});
	
	it('should update nested fields', function() {
		List.fields['nested.code'].updateItem(testItem, {
			nested: {
				code: 'foo(bar);'
			}
		});
		demand(testItem.nested.code).be('foo(bar);');
		testItem.nested.code = undefined;
	});
	
	it('should update nested fields with flat paths', function() {
		List.fields['nested.code'].updateItem(testItem, {
			'nested.code': 'foo(bar);'
		});
		demand(testItem.nested.code).be('foo(bar);');
		testItem.nested.code = undefined;
	});
};
