var assert = require('assert'),
	keystone = require('../../../..'),
	demand = require('must'),
	UpdateHandler = require('../../../../lib/updateHandler'),
	MoneyType = require('../MoneyType');

exports.initList = function(List) {
	List.add({
		money: { type: MoneyType },
		nested: {
			money: { type: MoneyType }
		}
	});
};

exports.testFieldType = function(List) {
	var testItem = new List.model();

	it('should update top level fields', function() {
		List.fields.money.updateItem(testItem, {
			money: 42
		});
		demand(testItem.money).be(42);
		testItem.money = undefined;
	});
	
	it('should update nested fields', function() {
		List.fields['nested.money'].updateItem(testItem, {
			nested: {
				money: 42
			}
		});
		demand(testItem.nested.money).be(42);
		testItem.nested.money = undefined;
	});
	
	it('should update nested fields with flat paths', function() {
		List.fields['nested.money'].updateItem(testItem, {
			'nested.money': 42
		});
		demand(testItem.nested.money).be(42);
		testItem.nested.money = undefined;
	}); 
	
	it('should reject invalid numbers'); 

	it('should convert invalid numbers'); 
};
