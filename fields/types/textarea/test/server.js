var demand = require('must'),
	TextareaType = require('../TextareaType');

exports.initList = function(List) {
	List.add({
		text: TextareaType,
		nested: {
			text: TextareaType
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
	
	it('should format to HTML', function() {
		List.fields.text.updateItem(testItem, {
			text: 'foo\nbar'
		});
		demand(testItem._.text.format()).be('foo<br>bar');
		testItem.text = undefined;
	}); 
	
	it('should truncate text with a length', function() {
		List.fields.text.updateItem(testItem, {
			text: 'foobar'
		});
		demand(testItem._.text.crop(5)).be('fooba');
		testItem.text = undefined;
	}); 
	
	it('should truncate text with a length and custom append string', function() {
		List.fields.text.updateItem(testItem, {
			text: 'foobar'
		});
		demand(testItem._.text.crop(5, '...')).be('fooba...');
		testItem.text = undefined;
	}); 
	
	it('should truncate text with and preserve words with a length, custom append string', function() {
		List.fields.text.updateItem(testItem, {
			text: 'foo bar lol'
		});
		demand(testItem._.text.crop(5, '...', true)).be('foo bar...');
		testItem.text = undefined;
	}); 
};
