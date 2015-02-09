var assert = require('assert'),
	keystone = require('../../../..'),
	demand = require('must'),
	UpdateHandler = require('../../../../lib/updateHandler'),
	NumberArrayType = require('../NumberArrayType');

exports.initList = function(List) {
	List.add({
		number: { type: NumberArrayType },
		nested: {
			number: { type: NumberArrayType }
		}
	});
};

exports.testFieldType = function(List) {
	var testItem = new List.model();

	it('should update top level fields', function() {
		List.fields.number.updateItem(testItem, {
			number: [1, 2, 3, 42]
		});
		demand(testItem.number).eql([1, 2, 3, 42]);
		testItem.number = undefined;
	});
	
	it('should update nested fields', function() {
		List.fields['nested.number'].updateItem(testItem, {
			nested: {
				number: [1, 2, 3, 42]
			}
		});
		demand(testItem.nested.number).eql([1, 2, 3, 42]);
		testItem.nested.number = undefined;
	});
	
	it('should update nested fields with flat paths', function() {
		List.fields['nested.number'].updateItem(testItem, {
			'nested.number': [1, 2, 3, 42]
		});
		demand(testItem.nested.number).eql([1, 2, 3, 42]);
		testItem.nested.number = undefined;
	});
};
