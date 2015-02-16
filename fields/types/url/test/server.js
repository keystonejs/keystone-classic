var demand = require('must'),
	UrlType = require('../UrlType');

exports.initList = function(List) {
	List.add({
		url: UrlType,
		nested: {
			url: UrlType
		}
	});
};

exports.testFieldType = function(List) {
	var testItem = new List.model();

	it('should update top level fields', function() {
		List.fields.url.updateItem(testItem, {
			url: 'value'
		});
		demand(testItem.url).be('value');
		testItem.url = undefined;
	});
	
	it('should update nested fields', function() {
		List.fields['nested.url'].updateItem(testItem, {
			nested: {
				url: 'value'
			}
		});
		demand(testItem.nested.url).be('value');
		testItem.nested.url = undefined;
	});
	
	it('should update nested fields with flat paths', function() {
		List.fields['nested.url'].updateItem(testItem, {
			'nested.url': 'value'
		});
		demand(testItem.nested.url).be('value');
		testItem.nested.url = undefined;
	}); 
	
	it('should strip the protocol when formatting', function() {
		List.fields.url.updateItem(testItem, {
			url: 'http://www.keystonejs.com'
		});
		demand(testItem._.url.format()).be('www.keystonejs.com');
		testItem.url = undefined;
	}); 
};
