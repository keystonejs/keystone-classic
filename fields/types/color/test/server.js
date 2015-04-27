var demand = require('must'),
	ColorType = require('../ColorType');

exports.initList = function(List) {
	List.add({
		color: { type: ColorType },
		nested: {
			color: { type: ColorType }
		}
	});
};

exports.createData = function(List) {//eslint-disable-line no-unused-vars

};

exports.testFilters = function(List) {//eslint-disable-line no-unused-vars

};

exports.testFieldType = function(List) {
	var testItem = new List.model();

	it('should update top level fields', function() {
		List.fields.color.updateItem(testItem, {
			color: '#ffffff'
		});
		demand(testItem.color).be('#ffffff');
		testItem.color = undefined;
	});
	
	it('should update nested fields', function() {
		List.fields['nested.color'].updateItem(testItem, {
			nested: {
				color: '#ffffff'
			}
		});
		demand(testItem.nested.color).be('#ffffff');
		testItem.nested.color = undefined;
	});
	
	it('should update nested fields with flat paths', function() {
		List.fields['nested.color'].updateItem(testItem, {
			'nested.color': '#ffffff'
		});
		demand(testItem.nested.color).be('#ffffff');
		testItem.nested.color = undefined;
	});
};
