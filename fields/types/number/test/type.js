var demand = require('must');
var NumberType = require('../NumberType');


exports.initList = function (List) {
	List.add({
		number: { type: NumberType },
		nested: {
			number: { type: NumberType },
		},
	});
};

exports.testFieldType = function (List) {
	describe('invalid options', function () {
		it('should throw when no options are passed', function (done) {
			try {
				List.add({
					noFormatString: { type: NumberType, format: /regexp/ },
				});
			} catch (err) {
				demand(err.message).eql('FieldType.Number: options.format must be a string.');
				done();
			}
		});
	});

	describe('updateItem', function () {
		it('should update top level fields', function (done) {
			var testItem = new List.model();
			List.fields.number.updateItem(testItem, {
				number: 42,
			}, function () {
				demand(testItem.number).be(42);
				done();
			});
		});

		it('should update nested fields', function (done) {
			var testItem = new List.model();
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
			var testItem = new List.model();
			List.fields['nested.number'].updateItem(testItem, {
				'nested.number': 42,
			}, function () {
				demand(testItem.nested.number).be(42);
				testItem.nested.number = undefined;
				done();
			});
		});

		it('should null value with empty string', function (done) {
			var testItem = new List.model();
			testItem.number = 1;
			List.fields.number.updateItem(testItem, {
				number: '',
			}, function () {
				demand(testItem.number).be.null();
				done();
			});
		});

		it('should null value when null', function (done) {
			var testItem = new List.model();
			testItem.number = 1;
			List.fields.number.updateItem(testItem, {
				number: null,
			}, function () {
				demand(testItem.number).be.null();
				done();
			});
		});

		it('should not null value when undefined', function (done) {
			var testItem = new List.model();
			testItem.number = 1;
			List.fields.number.updateItem(testItem, {
				number: undefined,
			}, function () {
				demand(testItem.number).be(1);
				done();
			});
		});

		it('should convert string values', function (done) {
			var testItem = new List.model({
				number: 1,
			});
			List.fields.number.updateItem(testItem, {
				number: '50.50',
			}, function () {
				demand(testItem.number).be(50.50);
				done();
			});
		});
	});

	describe('validateInput', function () {
		it('should validate numeric input', function (done) {
			List.fields.number.validateInput({ number: 1 }, function (result) {
				demand(result).be.true();
				done();
			});
		});

		it('should validate undefined input', function (done) {
			List.fields.number.validateInput({}, function (result) {
				demand(result).be.true();
				done();
			});
		});

		it('should validate null input', function (done) {
			List.fields.number.validateInput({ number: null }, function (result) {
				demand(result).be.true();
				done();
			});
		});

		it('should validate empty string input', function (done) {
			List.fields.number.validateInput({ number: '' }, function (result) {
				demand(result).be.true();
				done();
			});
		});

		it('should validate numeric string input', function (done) {
			List.fields.number.validateInput({ number: '1' }, function (result) {
				demand(result).be.true();
				done();
			});
		});

		it('should invalidate string input', function (done) {
			List.fields.number.validateInput({ number: 'a' }, function (result) {
				demand(result).be.false();
				done();
			});
		});


		it('should invalidate object input', function (done) {
			List.fields.number.validateInput({ number: { things: 'stuff' } }, function (result) {
				demand(result).be.false();
				done();
			});
		});

		it('should invalidate array input', function (done) {
			List.fields.number.validateInput({ number: [1, 2, 3] }, function (result) {
				demand(result).be.false();
				done();
			});
		});

		it('should invalidate Boolean input', function (done) {
			List.fields.number.validateInput({ number: true }, function (result) {
				demand(result).be.false();
				done();
			});
		});

		it('should invalidate function input', function (done) {
			List.fields.number.validateInput({ number: function () {} }, function (result) {
				demand(result).be.false();
				done();
			});
		});

		it('should invalidate regexp input', function (done) {
			List.fields.number.validateInput({ number: /foo/ }, function (result) {
				demand(result).be.false();
				done();
			});
		});

		it('should invalidate date input', function (done) {
			List.fields.number.validateInput({ number: new Date() }, function (result) {
				demand(result).be.false();
				done();
			});
		});
	});

	describe('validateRequiredInput', function () {
		it('should validate numeric input', function (done) {
			var testItem = new List.model();
			List.fields.number.validateRequiredInput(testItem, { number: 1 }, function (result) {
				demand(result).be.true();
				done();
			});
		});

		it('should validate numeric string input', function (done) {
			var testItem = new List.model();
			List.fields.number.validateRequiredInput(testItem, { number: '1' }, function (result) {
				demand(result).be.true();
				done();
			});
		});

		it('should invalidate undefined input', function (done) {
			var testItem = new List.model();
			List.fields.number.validateRequiredInput(testItem, {}, function (result) {
				demand(result).be.false();
				done();
			});
		});

		it('should validate undefined input if data exists', function (done) {
			var testItem = new List.model({
				number: 1,
			});
			List.fields.number.validateRequiredInput(testItem, {}, function (result) {
				demand(result).be.true();
				done();
			});
		});

		it('should invalidate null input', function (done) {
			var testItem = new List.model();
			List.fields.number.validateRequiredInput(testItem, { number: null }, function (result) {
				demand(result).be.false();
				done();
			});
		});

		it('should invalidate empty string input', function (done) {
			var testItem = new List.model();
			List.fields.number.validateRequiredInput(testItem, { number: '' }, function (result) {
				demand(result).be.false();
				done();
			});
		});
	});

	describe('addFilterToQuery', function () {
		it('should filter for a specific number', function () {
			var result = List.fields.number.addFilterToQuery({
				value: 10,
			});
			demand(result.number).eql(10);
		});

		it('should filter greater than a specific number', function () {
			var result = List.fields.number.addFilterToQuery({
				value: 0,
				mode: 'gt',
			});
			demand(result.number).eql({
				$gt: 0,
			});
		});

		it('should filter less than a specific number', function () {
			var result = List.fields.number.addFilterToQuery({
				value: 10,
				mode: 'lt',
			});
			demand(result.number).eql({
				$lt: 10,
			});
		});

		it('should support inverted less than', function () {
			var result = List.fields.number.addFilterToQuery({
				value: 10,
				mode: 'lt',
				inverted: true,
			});
			demand(result.number).eql({
				$gt: 10,
			});
		});

		it('should support inverted greater than', function () {
			var result = List.fields.number.addFilterToQuery({
				value: 10,
				mode: 'gt',
				inverted: true,
			});
			demand(result.number).eql({
				$lt: 10,
			});
		});

		it('should filter for existance', function () {
			var result = List.fields.number.addFilterToQuery({
				mode: 'equals',
			});
			demand(result.number).eql({
				$in: ['', null],
			});
		});

		it('should filter for non-existance', function () {
			var result = List.fields.number.addFilterToQuery({
				mode: 'equals',
				inverted: true,
			});
			demand(result.number).eql({
				$nin: ['', null],
			});
		});

		it('should filter between two numbers', function () {
			var result = List.fields.number.addFilterToQuery({
				mode: 'between',
				value: {
					min: 0,
					max: 10,
				},
			});
			demand(result.number).eql({
				$gte: 0,
				$lte: 10,
			});
		});

		it('should filter exluding a range between two numbers', function () {
			var result = List.fields.number.addFilterToQuery({
				mode: 'between',
				value: {
					min: 0,
					max: 10,
				},
				inverted: true,
			});
			demand(result).eql({
				$or: [
					{ number: { $gt: 10 } },
					{ number: { $lt: 0 } },
				],
			});
		});

		it('should filter between two number strings', function () {
			var result = List.fields.number.addFilterToQuery({
				mode: 'between',
				value: {
					min: '0',
					max: '10',
				},
			});
			demand(result.number).eql({
				$gte: 0,
				$lte: 10,
			});
		});

		it('should not filter if the value is NaN', function () {
			var result = List.fields.number.addFilterToQuery({
				value: NaN,
			});
			demand(result.number).be.undefined();
		});

		it('should not filter between two numbers if one is NaN', function () {
			var result = List.fields.number.addFilterToQuery({
				mode: 'between',
				value: {
					min: NaN,
					max: 10,
				},
			});
			demand(result.number).be.undefined();
		});
	});

	/* Deprecated inputIsValid method tests */

	it('should validate numeric input', function () {
		demand(List.fields.number.inputIsValid({
			number: 0,
		})).be.true();
		demand(List.fields.number.inputIsValid({
			number: 1,
		})).be.true();
		demand(List.fields.number.inputIsValid({
			number: -1,
		})).be.true();
		demand(List.fields.number.inputIsValid({
			number: 1.1,
		})).be.true();
	});

	it('should validate string input', function () {
		demand(List.fields.number.inputIsValid({
			number: '0',
		})).be.true();
		demand(List.fields.number.inputIsValid({
			number: '1',
		})).be.true();
		demand(List.fields.number.inputIsValid({
			number: '-1',
		})).be.true();
		demand(List.fields.number.inputIsValid({
			number: '1.1',
		})).be.true();
	});

	it('should validate no input', function () {
		demand(List.fields.number.inputIsValid({})).be.true();
		demand(List.fields.number.inputIsValid({}, true)).be.false();
		var testItem = new List.model({
			number: 1,
		});
		demand(List.fields.number.inputIsValid({}, true, testItem)).be.true();
	});

	it('should validate empty strings', function () {
		demand(List.fields.number.inputIsValid({
			number: '',
		})).be.true();
		demand(List.fields.number.inputIsValid({
			number: '',
		}, true)).be.false();
		var testItem = new List.model({
			number: 1,
		});
		demand(List.fields.number.inputIsValid({
			number: '',
		}, true, testItem)).be.false();
	});

	it('should invalidate invalid input', function () {
		demand(List.fields.number.inputIsValid({
			number: {},
		})).be.false();
		demand(List.fields.number.inputIsValid({
			number: [],
		})).be.false();
		demand(List.fields.number.inputIsValid({
			number: 'a',
		})).be.false();
	});
};
