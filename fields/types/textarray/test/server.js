var assert = require('assert'),
	keystone = require('../../../..'),
	demand = require('must'),
	UpdateHandler = require('../../../../lib/updateHandler'),
	TextArrayType = require('../TextArrayType');

exports.initList = function(List) {
	List.add({
		text: TextArrayType,
		nested: {
			text: TextArrayType
		}
	});
};

exports.testFieldType = function(List) {
	var testItem = new List.model();

	it('should update top level fields', function() {
		List.fields.text.updateItem(testItem, {
			text: ['foo', 'bar']
		});
		demand(testItem.text).eql(['foo', 'bar']);
		testItem.text = undefined;
	});
	
	it('should update nested fields', function() {
		List.fields['nested.text'].updateItem(testItem, {
			nested: {
				text: ['foo', 'bar']
			}
		});
		demand(testItem.nested.text).eql(['foo', 'bar']);
		testItem.nested.text = undefined;
	});
	
	it('should update nested fields with flat paths', function() {
		List.fields['nested.text'].updateItem(testItem, {
			'nested.text': ['foo', 'bar']
		});
		demand(testItem.nested.text).eql(['foo', 'bar']);
		testItem.nested.text = undefined;
	});	
	
	it('should crop and truncate', function() {
		List.fields.text.updateItem(testItem, {
			text: ['foo', 'bar']
		});
		demand(testItem._.text.crop(5)).eql(['foo', 'bar']);
		testItem.nested.text = undefined;
	});	
};
