var demand = require('must'),
	TextArrayType = require('../TextArrayType');

exports.initList = function(List) {
	List.add({
		textarr: TextArrayType,
		nested: {
			textarr: TextArrayType
		}
	});
};

exports.testFieldType = function(List) {
	var testItem = new List.model();
	
	it('should default to an empty array', function() {
		demand(testItem.get('textarr')).eql([]);
	});
	
	it('should validate input', function() {
		demand(List.fields.textarr.validateInput({
			textarr: ['a']
		})).be(true);
		demand(List.fields.textarr.validateInput({
			textarr: ['a', 'b']
		})).be(true);
	});
	
	it('should validate no input', function() {
		demand(List.fields.textarr.validateInput({})).be(true);
		demand(List.fields.textarr.validateInput({}, true)).be(false);
		testItem.textarr = ['a'];
		demand(List.fields.textarr.validateInput({}, true, testItem)).be(true);
		testItem.textarr = undefined;
	});
	
	it('should validate length when required', function() {
		demand(List.fields.textarr.validateInput({
			textarr: []
		}, true)).be(false);
	});
	
	it('should invalidate arrays with complex values', function() {
		demand(List.fields.textarr.validateInput({
			textarr: [[]]
		}, true)).be(false);
	});
	
	it('should update top level fields', function() {
		List.fields.textarr.updateItem(testItem, {
			textarr: ['a', 'b']
		});
		demand(testItem.textarr).eql(['a', 'b']);
		testItem.textarr = undefined;
	});
	
	it('should update nested fields', function() {
		List.fields['nested.textarr'].updateItem(testItem, {
			nested: {
				textarr: ['a', 'b']
			}
		});
		demand(testItem.nested.textarr).eql(['a', 'b']);
		testItem.nested.textarr = undefined;
	});
	
	it('should update nested fields with flat paths', function() {
		List.fields['nested.textarr'].updateItem(testItem, {
			'nested.textarr': ['a', 'b']
		});
		demand(testItem.nested.textarr).eql(['a', 'b']);
		testItem.nested.textarr = undefined;
	});
	
	it('should update empty arrays', function() {
		List.fields.textarr.updateItem(testItem, {
			textarr: []
		});
		demand(testItem.textarr).eql([]);
		testItem.textarr = undefined;
	});
	
	it('should default on null', function() {
		List.fields.textarr.updateItem(testItem, {
			textarr: null
		});
		demand(testItem.textarr).eql([]);
		testItem.textarr = undefined;
	});
	
	it('should allow a single string value', function() {
		List.fields.textarr.updateItem(testItem, {
			textarr: 'a'
		});
		demand(testItem.textarr).eql(['a']);
		testItem.textarr = undefined;
	});
	
	it('should convert numbers to strings', function() {
		List.fields.textarr.updateItem(testItem, {
			textarr: 1
		});
		demand(testItem.textarr).eql(['1']);
		testItem.textarr = undefined;
	});
};
