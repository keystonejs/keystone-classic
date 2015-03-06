var demand = require('must'),
	KeyType = require('../KeyType');

exports.initList = function(List) {
	List.add({
		key: { type: KeyType },
		nested: {
			key: { type: KeyType }
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
		List.fields.key.updateItem(testItem, {
			key: 'foobar'
		});
		demand(testItem.key).be('foobar');
		testItem.key = undefined;
	});
	
	it('should update nested fields', function() {
		List.fields['nested.key'].updateItem(testItem, {
			nested: {
				key: 'foobar'
			}
		});
		demand(testItem.nested.key).be('foobar');
		testItem.nested.key = undefined;
	});
	
	it('should update nested fields with flat paths', function() {
		List.fields['nested.key'].updateItem(testItem, {
			'nested.key': 'foobar'
		});
		demand(testItem.nested.key).be('foobar');
		testItem.nested.key = undefined;
	});
};
