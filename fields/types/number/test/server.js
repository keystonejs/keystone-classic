var demand = require('must');
var NumberType = require('../NumberType');
var validators = require('../../validators');

exports.initList = function (List) {
	List.add({
		number: { type: NumberType },
		nested: {
			number: { type: NumberType },
		},
	});
};

exports.testFieldType = function (List) {
	var testItem = new List.model();

	it('should validate numeric input', function () {
		demand(List.fields.number.inputIsValid({
			number: 0,
		})).be(true);
		demand(List.fields.number.inputIsValid({
			number: 1,
		})).be(true);
		demand(List.fields.number.inputIsValid({
			number: -1,
		})).be(true);
		demand(List.fields.number.inputIsValid({
			number: 1.1,
		})).be(true);
	});

	it('should validate string input', function () {
		demand(List.fields.number.inputIsValid({
			number: '0',
		})).be(true);
		demand(List.fields.number.inputIsValid({
			number: '1',
		})).be(true);
		demand(List.fields.number.inputIsValid({
			number: '-1',
		})).be(true);
		demand(List.fields.number.inputIsValid({
			number: '1.1',
		})).be(true);
	});

	it('should validate no input', function () {
		demand(List.fields.number.inputIsValid({})).be(true);
		demand(List.fields.number.inputIsValid({}, true)).be(false);
		testItem.number = 1;
		demand(List.fields.number.inputIsValid({}, true, testItem)).be(true);
		testItem.number = undefined;
	});

	it('should validate empty strings', function () {
		demand(List.fields.number.inputIsValid({
			number: '',
		})).be(true);
		demand(List.fields.number.inputIsValid({
			number: '',
		}, true)).be(false);
		testItem.number = 1;
		demand(List.fields.number.inputIsValid({
			number: '',
		}, true, testItem)).be(false);
		testItem.number = undefined;
	});

	it('should invalidate invalid input', function () {
		demand(List.fields.number.inputIsValid({
			number: {},
		})).be(false);
		demand(List.fields.number.inputIsValid({
			number: [],
		})).be(false);
		demand(List.fields.number.inputIsValid({
			number: 'a',
		})).be(false);
	});

	it('should update top level fields', function (done) {
		List.fields.number.updateItem(testItem, {
			number: 42,
		}, function () {
			demand(testItem.number).be(42);
			testItem.number = undefined;
			done();
		});
	});

	it('should update nested fields', function (done) {
		List.fields['nested.number'].updateItem(testItem, {
			nested: {
				number: 42,
			},
		}, function () {
			demand(testItem.nested.number).be(42);
			testItem.nested.number = undefined;
			done();
		});
	});

	it('should update nested fields with flat paths', function (done) {
		List.fields['nested.number'].updateItem(testItem, {
			'nested.number': 42,
		}, function () {
			demand(testItem.nested.number).be(42);
			testItem.nested.number = undefined;
			done();
		});
	});

	it('should null value with empty string', function (done) {
		testItem.number = 1;
		List.fields.number.updateItem(testItem, {
			number: '',
		}, function () {
			demand(testItem.number).be(null);
			testItem.number = undefined;
			done();
		});
	});

	it('should null value when null', function (done) {
		testItem.number = 1;
		List.fields.number.updateItem(testItem, {
			number: null,
		}, function () {
			demand(testItem.number).be(null);
			testItem.number = undefined;
			done();
		});
	});

	it('should not null value when undefined', function (done) {
		testItem.number = 1;
		List.fields.number.updateItem(testItem, {
			number: undefined,
		}, function () {
			demand(testItem.number).be(1);
			testItem.number = undefined;
			done();
		});
	});

	it('should convert string values', function (done) {
		testItem.number = 1;
		List.fields.number.updateItem(testItem, {
			number: '50.50',
		}, function () {
			demand(testItem.number).be(50.50);
			testItem.number = undefined;
			done();
		});
	});

	it('should validate numeric input', function (done) {
		List.fields.number.validateInput({ number: 1 }, function (result) {
			demand(result).be(true);
			done();
		});
	});

	it('should use the common number input validator', function () {
		demand(List.fields.number.validateInput === validators.number.input);
	});

	it('should use the common number required validator', function () {
		demand(List.fields.number.validateRequiredInput === validators.number.required);
	});

	it('should validate undefined input', function (done) {
		List.fields.number.validateInput({}, function (result) {
			demand(result).be(true);
			done();
		});
	});

	it('should invalidate string input', function (done) {
		List.fields.number.validateInput({ number: 'a' }, function (result) {
			demand(result).be(false);
			done();
		});
	});


	it('should invalidate object input', function (done) {
		List.fields.number.validateInput({ number: { things: 'stuff' } }, function (result) {
			demand(result).be(false);
			done();
		});
	});

	it('should invalidate array input', function (done) {
		List.fields.number.validateInput({ number: [1, 2, 3] }, function (result) {
			demand(result).be(false);
			done();
		});
	});

	it('should invalidate Boolean input', function (done) {
		List.fields.number.validateInput({ number: true }, function (result) {
			demand(result).be(false);
			done();
		});
	});

	it('should invalidate function input', function (done) {
		List.fields.number.validateInput({ number: function () {} }, function (result) {
			demand(result).be(false);
			done();
		});
	});

	it('should invalidate regexp input', function (done) {
		List.fields.number.validateInput({ number: /foo/ }, function (result) {
			demand(result).be(false);
			done();
		});
	});


// This test is returning true, why?
	it('should invalidate date input', function (done) {
		List.fields.number.validateInput({ number: new Date() }, function (result) {
			demand(result).be(false);
			done();
		});
	});

	it('should invalidate null input', function (done) {
		List.fields.number.validateInput({ number: null }, function (result) {
			demand(result).be(false);
			done();
		});
	});
};
