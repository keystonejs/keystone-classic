var assert = require('assert'),
	keystone = require('../../../..'),
	demand = require('must'),
	UpdateHandler = require('../../../../lib/updateHandler'),
	NumberType = require('../NumberType');

exports.initList = function(List) {
	List.add({
		number: { type: NumberType },
		nested: {
			number: { type: NumberType }
		}
	});
};

exports.testFieldType = function(List) {
	var testItem = new List.model();

	it('should update top level fields', function() {
		List.fields.number.updateItem(testItem, {
			number: 42
		});
		demand(testItem.number).be(42);
		testItem.number = undefined;
	});
	
	it('should update nested fields', function() {
		List.fields['nested.number'].updateItem(testItem, {
			nested: {
				number: 42
			}
		});
		demand(testItem.nested.number).be(42);
		testItem.nested.number = undefined;
	});
	
	it('should update nested fields with flat paths', function() {
		List.fields['nested.number'].updateItem(testItem, {
			'nested.number': 42
		});
		demand(testItem.nested.number).be(42);
		testItem.nested.number = undefined;
	}); 
};
