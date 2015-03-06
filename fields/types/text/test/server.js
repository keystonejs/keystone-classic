var demand = require('must');

exports.initList = function(List) {
	List.add({
		text: String,
		nested: {
			text: String
		}
	});
};

exports.testFieldType = function(List) {
	var testItem = new List.model();

	it('should update top level fields', function() {
		List.fields.text.updateItem(testItem, {
			text: 'value'
		});
		demand(testItem.text).be('value');
		testItem.text = undefined;
	});
	
	it('should update nested fields', function() {
		List.fields['nested.text'].updateItem(testItem, {
			nested: {
				text: 'value'
			}
		});
		demand(testItem.nested.text).be('value');
		testItem.nested.text = undefined;
	});
	
	it('should update nested fields with flat paths', function() {
		List.fields['nested.text'].updateItem(testItem, {
			'nested.text': 'value'
		});
		demand(testItem.nested.text).be('value');
		testItem.nested.text = undefined;
	});	
};
