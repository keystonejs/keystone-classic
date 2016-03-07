var demand = require('must');
var MoneyType = require('../MoneyType');

exports.initList = function (List) {
	List.add({
		money: { type: MoneyType },
		nested: {
			money: { type: MoneyType },
		},
	});
};

exports.testFieldType = function (List) {
	var testItem = new List.model();

	it('should update top level fields', function (done) {
		List.fields.money.updateItem(testItem, {
			money: 42,
		}, function () {
			demand(testItem.money).be(42);
			testItem.money = undefined;
			done();
		});
	});

	it('should update nested fields', function (done) {
		List.fields['nested.money'].updateItem(testItem, {
			nested: {
				money: 42,
			},
		}, function () {
			demand(testItem.nested.money).be(42);
			testItem.nested.money = undefined;
			done();
		});
	});

	it('should update nested fields with flat paths', function (done) {
		List.fields['nested.money'].updateItem(testItem, {
			'nested.money': 42,
		}, function () {
			demand(testItem.nested.money).be(42);
			testItem.nested.money = undefined;
			done();
		});
	});

	it('should validate numeric input', function () {
		demand(List.fields.money.inputIsValid({
			money: 0,
		})).be(true);
		demand(List.fields.money.inputIsValid({
			money: 1,
		})).be(true);
		demand(List.fields.money.inputIsValid({
			money: -1,
		})).be(true);
		demand(List.fields.money.inputIsValid({
			money: 1.1,
		})).be(true);
	});

	it('should validate string input', function () {
		demand(List.fields.money.inputIsValid({
			money: '0',
		})).be(true);
		demand(List.fields.money.inputIsValid({
			money: '1',
		})).be(true);
		demand(List.fields.money.inputIsValid({
			money: '-1',
		})).be(true);
		demand(List.fields.money.inputIsValid({
			money: '1.1',
		})).be(true);
		demand(List.fields.money.inputIsValid({
			money: '$0',
		})).be(true);
		demand(List.fields.money.inputIsValid({
			money: '$1',
		})).be(true);
		demand(List.fields.money.inputIsValid({
			money: '$-1',
		})).be(true);
		demand(List.fields.money.inputIsValid({
			money: '$1.1',
		})).be(true);
	});

	it('should validate no input', function () {
		demand(List.fields.money.inputIsValid({})).be(true);
		demand(List.fields.money.inputIsValid({}, true)).be(false);
		demand(List.fields.money.inputIsValid({ money: '' })).be(true);
		demand(List.fields.money.inputIsValid({ money: '' }, true)).be(false);
		testItem.money = 1;
		demand(List.fields.money.inputIsValid({}, true, testItem)).be(true);
		testItem.money = undefined;
	});

	it('should invalidate invalid input', function () {
		demand(List.fields.money.inputIsValid({
			money: {},
		})).be(false);
		demand(List.fields.money.inputIsValid({
			money: [],
		})).be(false);
		demand(List.fields.money.inputIsValid({
			money: 'a',
		})).be(false);
	});

	it('should properly format', function () {
		testItem.money = 1234;
		demand(testItem._.money.format()).be('$1,234.00');
		testItem.money = -244;
		demand(testItem._.money.format()).be('-$244.00');
	});

	it('should ignore formatting if the format option is false', function () {
		testItem.money = 1234;
		demand(testItem._.money.format()).be('$1,234.00');
		testItem.money = -244;
		demand(testItem._.money.format()).be('-$244.00');
	});

	it('should validate numeric input', function () {
		List.fields.money.validateInput({ money: 1 }, function (result) {
			demand(result).be(true);
		});
	});
};
