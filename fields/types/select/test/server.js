var demand = require('must'),
	SelectType = require('../SelectType');

exports.initList = function(List) {
	List.add({
		select: { type: SelectType, options: 'one, two, three' },
		nested: {
			select: { type: SelectType, options: 'one, two, three' }
		}
	});
};

exports.testFieldType = function(List) {
	var testItem = new List.model();

	it('should update top level fields', function() {
		List.fields.select.updateItem(testItem, {
			select: 'one'
		});
		demand(testItem.select).be('one');
		testItem.select = undefined;
	});
	
	it('should update nested fields', function() {
		List.fields['nested.select'].updateItem(testItem, {
			nested: {
				select: 'one'
			}
		});
		demand(testItem.nested.select).be('one');
		testItem.nested.select = undefined;
	});
	
	it('should update nested fields with flat paths', function() {
		List.fields['nested.select'].updateItem(testItem, {
			'nested.select': 'one'
		});
		demand(testItem.nested.select).be('one');
		testItem.nested.select = undefined;
	});	
};
