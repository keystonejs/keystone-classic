var demand = require('must'),
	NumberType = require('../NumberType');

exports.initList = function(List) {
	List.add({
		number: { type: NumberType },
		nested: {
			number: { type: NumberType }
		}
	});
};

exports.testFieldType = function(List) {
	var testItem = new List.model();

	it('should validate numeric input', function() {
		demand(List.fields.number.validateInput({
			number: 0
		})).be(true);
		demand(List.fields.number.validateInput({
			number: 1
		})).be(true);
		demand(List.fields.number.validateInput({
			number: -1
		})).be(true);
		demand(List.fields.number.validateInput({
			number: 1.1
		})).be(true);
	});

	it('should validate string input', function() {
		demand(List.fields.number.validateInput({
			number: '0'
		})).be(true);
		demand(List.fields.number.validateInput({
			number: '1'
		})).be(true);
		demand(List.fields.number.validateInput({
			number: '-1'
		})).be(true);
		demand(List.fields.number.validateInput({
			number: '1.1'
		})).be(true);
	});

	it('should validate no input', function() {
		demand(List.fields.number.validateInput({})).be(true);
		demand(List.fields.number.validateInput({}, true)).be(false);
		testItem.number = 1;
		demand(List.fields.number.validateInput({}, true, testItem)).be(true);
		testItem.number = undefined;
	});

	it('should validate empty strings', function() {
		demand(List.fields.number.validateInput({
			number: ''
		})).be(true);
		demand(List.fields.number.validateInput({
			number: ''
		}, true)).be(false);
		testItem.number = 1;
		demand(List.fields.number.validateInput({
			number: ''
		}, true, testItem)).be(false);
		testItem.number = undefined;
	});

	it('should invalidate invalid input', function() {
		demand(List.fields.number.validateInput({
			number: {}
		})).be(false);
		demand(List.fields.number.validateInput({
			number: []
		})).be(false);
		demand(List.fields.number.validateInput({
			number: 'a'
		})).be(false);
	});

	it('should update top level fields', function() {
		List.fields.number.updateItem(testItem, {
			number: 42
		});
		demand(testItem.number).be(42);
		testItem.number = undefined;
	});

	it('should update nested fields', function() {
		List.fields['nested.number'].updateItem(testItem, {
			nested: {
				number: 42
			}
		});
		demand(testItem.nested.number).be(42);
		testItem.nested.number = undefined;
	});

	it('should update nested fields with flat paths', function() {
		List.fields['nested.number'].updateItem(testItem, {
			'nested.number': 42
		});
		demand(testItem.nested.number).be(42);
		testItem.nested.number = undefined;
	});

	it('should null value with empty string', function() {
		testItem.number = 1;
		List.fields.number.updateItem(testItem, {
			number: ''
		});
		demand(testItem.number).be(null);
		testItem.number = undefined;
	});

	it('should not null value when null', function() {
		testItem.number = 1;
		List.fields.number.updateItem(testItem, {
			number: null
		});
		demand(testItem.number).be(null);
		testItem.number = undefined;
	});

	it('should not null value when undefined', function() {
		testItem.number = 1;
		List.fields.number.updateItem(testItem, {
			number: undefined
		});
		demand(testItem.number).be(1);
		testItem.number = undefined;
	});

	it('should convert string values', function() {
		testItem.number = 1;
		List.fields.number.updateItem(testItem, {
			number: '50.50'
		});
		demand(testItem.number).be(50.50);
		testItem.number = undefined;
	});
};
