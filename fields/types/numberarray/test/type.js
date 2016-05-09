var demand = require('must');
var NumberArrayType = require('../NumberArrayType');

exports.initList = function (List) {
	List.add({
		numarr: { type: NumberArrayType },
		nested: {
			numarr: { type: NumberArrayType },
		},
	});
};

exports.testFieldType = function (List) {
	describe('invalid options', function () {
		it('should throw when no options are passed', function (done) {
			try {
				List.add({
					noFormatString: { type: NumberArrayType, format: /regexp/ },
				});
			} catch (err) {
				demand(err.message).eql('FieldType.NumberArray: options.format must be a string.');
				done();
			}
		});
	});

	it('should default to an empty array', function () {
		var testItem = new List.model();
		demand(testItem.get('numarr')).eql([]);
	});

	describe('validateInput', function () {
		it('should validate top level fields', function (done) {
			List.fields.numarr.validateInput({
				numarr: [1, 2, 3],
			}, function (result) {
				demand(result).be.true();
				done();
			});
		});

		it('should validate nested fields', function (done) {
			List.fields['nested.numarr'].validateInput({
				nested: {
					numarr: [1, 2, 3],
				},
			}, function (result) {
				demand(result).be.true();
				done();
			});
		});

		it('should validate nested fields with flat paths', function (done) {
			List.fields['nested.numarr'].validateInput({
				'nested.numarr': [1, 2, 3],
			}, function (result) {
				demand(result).be.true();
				done();
			});
		});

		// A single number will be coerced to an array, so we let it pass
		it('should validate a number', function (done) {
			List.fields.numarr.validateInput({
				numarr: 1,
			}, function (result) {
				demand(result).be.true();
				done();
			});
		});

		// An empty array clears the value, so we let it pass
		it('should validate an empty array', function (done) {
			List.fields.numarr.validateInput({
				numarr: [],
			}, function (result) {
				demand(result).be.true();
				done();
			});
		});

		// A blank string clears the value, so we let it pass
		it('should validate a blank string', function (done) {
			List.fields.numarr.validateInput({
				numarr: '',
			}, function (result) {
				demand(result).be.true();
				done();
			});
		});

		// null clears the value, so we let it pass
		it('should validate null', function (done) {
			List.fields.numarr.validateInput({
				numarr: null,
			}, function (result) {
				demand(result).be.true();
				done();
			});
		});

		// undefined doesn't change anything, so we let it pass
		it('should validate undefined', function (done) {
			List.fields.numarr.validateInput({
				numarr: undefined,
			}, function (result) {
				demand(result).be.true();
				done();
			});
		});

		it('should validate a number string', function (done) {
			List.fields.numarr.validateInput({
				numarr: '1',
			}, function (result) {
				demand(result).be.true();
				done();
			});
		});

		it('should validate an array of number strings', function (done) {
			List.fields.numarr.validateInput({
				numarr: ['1', '2', '3'],
			}, function (result) {
				demand(result).be.true();
				done();
			});
		});

		it('should validate a mixed array of number strings and numbers', function (done) {
			List.fields.numarr.validateInput({
				numarr: ['1', 2, '3', 4],
			}, function (result) {
				demand(result).be.true();
				done();
			});
		});

		it('should invalidate false', function (done) {
			List.fields.numarr.validateInput({
				numarr: false,
			}, function (result) {
				demand(result).be.false();
				done();
			});
		});

		it('should invalidate true', function (done) {
			List.fields.numarr.validateInput({
				numarr: true,
			}, function (result) {
				demand(result).be.false();
				done();
			});
		});

		it('should invalidate a string', function (done) {
			List.fields.numarr.validateInput({
				numarr: 'aaa',
			}, function (result) {
				demand(result).be.false();
				done();
			});
		});

		it('should invalidate an array with a single string', function (done) {
			List.fields.numarr.validateInput({
				numarr: ['aaa'],
			}, function (result) {
				demand(result).be.false();
				done();
			});
		});

		it('should invalidate an array with string somewhere', function (done) {
			List.fields.numarr.validateInput({
				numarr: [1, 2, 'aaa', 4],
			}, function (result) {
				demand(result).be.false();
				done();
			});
		});
	});

	describe('validateRequiredInput', function () {
		it('should validate an array of numbers', function (done) {
			var testItem = new List.model();
			List.fields.numarr.validateRequiredInput(testItem, {
				numarr: [1, 2, 3],
			}, function (result) {
				demand(result).be.true();
				done();
			});
		});

		it('should validate a nested array of numbers', function (done) {
			var testItem = new List.model();
			List.fields['nested.numarr'].validateRequiredInput(testItem, {
				nested: {
					numarr: [1, 2],
				},
			}, function (result) {
				demand(result).be.true();
				done();
			});
		});

		it('should validate a nested array of numbers with a flat paths', function (done) {
			List.fields.numarr.validateInput({
				'nested.numarr': [1, 2],
			}, function (result) {
				demand(result).be.true();
				done();
			});
		});

		it('should invalidate an empty string', function (done) {
			var testItem = new List.model();
			List.fields.numarr.validateRequiredInput(testItem, {
				numarr: '',
			}, function (result) {
				demand(result).be.false();
				done();
			});
		});

		it('should invalidate undefined', function (done) {
			var testItem = new List.model();
			List.fields.numarr.validateRequiredInput(testItem, {
				numarr: undefined,
			}, function (result) {
				demand(result).be.false();
				done();
			});
		});

		it('should validate undefined if a value exists', function (done) {
			var testItem = new List.model({
				numarr: [1],
			});
			List.fields.numarr.validateRequiredInput(testItem, {
				numarr: undefined,
			}, function (result) {
				demand(result).be.true();
				done();
			});
		});

		it('should invalidate null', function (done) {
			var testItem = new List.model();
			List.fields.numarr.validateRequiredInput(testItem, {
				numarr: null,
			}, function (result) {
				demand(result).be.false();
				done();
			});
		});

		it('should invalidate an array with an empty string', function (done) {
			var testItem = new List.model();
			List.fields.numarr.validateRequiredInput(testItem, {
				numarr: [''],
			}, function (result) {
				demand(result).be.false();
				done();
			});
		});

		it('should invalidate an array with empty strings', function (done) {
			var testItem = new List.model();
			List.fields.numarr.validateRequiredInput(testItem, {
				numarr: [1, '', 2, '3'],
			}, function (result) {
				demand(result).be.false();
				done();
			});
		});
	});

	describe('updateItem', function () {
		it('should update top level fields', function (done) {
			var testItem = new List.model();
			List.fields.numarr.updateItem(testItem, {
				numarr: [1, 2, 3, 42],
			}, function () {
				demand(testItem.numarr).eql([1, 2, 3, 42]);
				done();
			});
		});

		it('should update nested fields', function (done) {
			var testItem = new List.model();
			List.fields['nested.numarr'].updateItem(testItem, {
				nested: {
					numarr: [1, 2, 3, 42],
				},
			}, function () {
				demand(testItem.nested.numarr).eql([1, 2, 3, 42]);
				done();
			});
		});

		it('should update nested fields with flat paths', function (done) {
			var testItem = new List.model();
			List.fields['nested.numarr'].updateItem(testItem, {
				'nested.numarr': [1, 2, 3, 42],
			}, function () {
				demand(testItem.nested.numarr).eql([1, 2, 3, 42]);
				done();
			});
		});

		it('should update empty arrays', function (done) {
			var testItem = new List.model();
			List.fields.numarr.updateItem(testItem, {
				numarr: [],
			}, function () {
				demand(testItem.numarr).eql([]);
				done();
			});
		});

		it('should delete all items of the array if the data object is undefined', function (done) {
			var testItem = new List.model();
			List.fields.numarr.updateItem(testItem, {
				numarr: [1, 2, 3, 42],
			}, function () {
				List.fields.numarr.updateItem(testItem, {
					numarr: undefined,
				}, function () {
					demand(testItem.numarr).eql([]);
					done();
				});
			});
		});

		it('should default on null', function (done) {
			var testItem = new List.model();
			List.fields.numarr.updateItem(testItem, {
				numarr: null,
			}, function () {
				demand(testItem.numarr).eql([]);
				done();
			});
		});

		it('should allow a single numeric value', function (done) {
			var testItem = new List.model();
			List.fields.numarr.updateItem(testItem, {
				numarr: 1,
			}, function () {
				demand(testItem.numarr).eql([1]);
				done();
			});
		});

		it('should convert strings to numbers', function (done) {
			var testItem = new List.model();
			List.fields.numarr.updateItem(testItem, {
				numarr: '1',
			}, function () {
				demand(testItem.numarr).eql([1]);
				done();
			});
		});

		it('should allow decimals', function (done) {
			var testItem = new List.model();
			List.fields.numarr.updateItem(testItem, {
				numarr: [0.1, '0.2'],
			}, function () {
				demand(testItem.numarr).eql([0.1, 0.2]);
				done();
			});
		});

		it('should ignore non-numeric strings and complex values', function (done) {
			var testItem = new List.model();
			List.fields.numarr.updateItem(testItem, {
				numarr: ['1', 'two', {}, 42],
			}, function () {
				demand(testItem.numarr).eql([1, 42]);
				done();
			});
		});
	});

	describe('addFilterToQuery', function () {
		describe('"some" present', function () {
			it('should filter for a specific number', function () {
				var result = List.fields.numarr.addFilterToQuery({
					presence: 'some',
					value: 10,
				});
				demand(result.numarr).eql({
					$elemMatch: {
						$eq: 10,
					},
				});
			});

			it('should filter greater than a specific number', function () {
				var result = List.fields.numarr.addFilterToQuery({
					presence: 'some',
					value: 0,
					mode: 'gt',
				});
				demand(result.numarr).eql({
					$elemMatch: {
						$gt: 0,
					},
				});
			});

			it('should filter less than a specific number', function () {
				var result = List.fields.numarr.addFilterToQuery({
					presence: 'some',
					value: 10,
					mode: 'lt',
				});
				demand(result.numarr).eql({
					$elemMatch: {
						$lt: 10,
					},
				});
			});

			it('should filter for existance', function () {
				var result = List.fields.numarr.addFilterToQuery({
					presence: 'some',
				});
				demand(result.numarr).eql({
					$size: 0,
				});
			});

			it('should filter between two numbers', function () {
				var result = List.fields.numarr.addFilterToQuery({
					presence: 'some',
					mode: 'between',
					value: {
						min: 0,
						max: 10,
					},
				});
				demand(result.numarr).eql({
					$elemMatch: {
						$gte: 0,
						$lte: 10,
					},
				});
			});

			it('should filter between two number strings', function () {
				var result = List.fields.numarr.addFilterToQuery({
					presence: 'some',
					mode: 'between',
					value: {
						min: '0',
						max: '10',
					},
				});
				demand(result.numarr).eql({
					$elemMatch: {
						$gte: 0,
						$lte: 10,
					},
				});
			});

			it('should not filter if the value is NaN', function () {
				var result = List.fields.numarr.addFilterToQuery({
					presence: 'some',
					value: NaN,
				});
				demand(result.numarr).be.undefined();
			});

			it('should not filter between two numbers if one is NaN', function () {
				var result = List.fields.numarr.addFilterToQuery({
					presence: 'some',
					mode: 'between',
					value: {
						min: NaN,
						max: 10,
					},
				});
				demand(result.numarr).be.undefined();
			});
		});

		describe('"none" present', function () {
			it('should filter for a non-existing specific number', function () {
				var result = List.fields.numarr.addFilterToQuery({
					presence: 'none',
					value: 10,
				});
				demand(result.numarr).eql({
					$not: {
						$eq: 10,
					},
				});
			});

			it('should filter greater than a specific number', function () {
				var result = List.fields.numarr.addFilterToQuery({
					presence: 'none',
					value: 0,
					mode: 'gt',
				});
				demand(result.numarr).eql({
					$not: {
						$gt: 0,
					},
				});
			});

			it('should filter less than a specific number', function () {
				var result = List.fields.numarr.addFilterToQuery({
					presence: 'none',
					value: 10,
					mode: 'lt',
				});
				demand(result.numarr).eql({
					$not: {
						$lt: 10,
					},
				});
			});

			it('should filter for existance', function () {
				var result = List.fields.numarr.addFilterToQuery({
					presence: 'none',
				});
				demand(result.numarr).eql({
					$not: {
						$size: 0,
					},
				});
			});

			it('should filter between two numbers', function () {
				var result = List.fields.numarr.addFilterToQuery({
					presence: 'none',
					mode: 'between',
					value: {
						min: 0,
						max: 10,
					},
				});
				demand(result.numarr).eql({
					$not: {
						$gte: 0,
						$lte: 10,
					},
				});
			});

			it('should filter between two number strings', function () {
				var result = List.fields.numarr.addFilterToQuery({
					presence: 'none',
					mode: 'between',
					value: {
						min: '0',
						max: '10',
					},
				});
				demand(result.numarr).eql({
					$not: {
						$gte: 0,
						$lte: 10,
					},
				});
			});

			it('should not filter if the value is NaN', function () {
				var result = List.fields.numarr.addFilterToQuery({
					presence: 'none',
					value: NaN,
				});
				demand(result.numarr).be.undefined();
			});

			it('should not filter between two numbers if one is NaN', function () {
				var result = List.fields.numarr.addFilterToQuery({
					presence: 'none',
					mode: 'between',
					value: {
						min: NaN,
						max: 10,
					},
				});
				demand(result.numarr).be.undefined();
			});
		});

		// Should default to the "some" behaviour
		describe('no presence option specified', function () {
			it('should filter for a specific number', function () {
				var result = List.fields.numarr.addFilterToQuery({
					value: 10,
				});
				demand(result.numarr).eql({
					$elemMatch: {
						$eq: 10,
					},
				});
			});

			it('should filter greater than a specific number', function () {
				var result = List.fields.numarr.addFilterToQuery({
					value: 0,
					mode: 'gt',
				});
				demand(result.numarr).eql({
					$elemMatch: {
						$gt: 0,
					},
				});
			});

			it('should filter less than a specific number', function () {
				var result = List.fields.numarr.addFilterToQuery({
					value: 10,
					mode: 'lt',
				});
				demand(result.numarr).eql({
					$elemMatch: {
						$lt: 10,
					},
				});
			});

			it('should filter for existance', function () {
				var result = List.fields.numarr.addFilterToQuery({
					mode: 'equals',
				});
				demand(result.numarr).eql({
					$size: 0,
				});
			});

			it('should filter between two numbers', function () {
				var result = List.fields.numarr.addFilterToQuery({
					mode: 'between',
					value: {
						min: 0,
						max: 10,
					},
				});
				demand(result.numarr).eql({
					$elemMatch: {
						$gte: 0,
						$lte: 10,
					},
				});
			});

			it('should filter between two number strings', function () {
				var result = List.fields.numarr.addFilterToQuery({
					mode: 'between',
					value: {
						min: '0',
						max: '10',
					},
				});
				demand(result.numarr).eql({
					$elemMatch: {
						$gte: 0,
						$lte: 10,
					},
				});
			});

			it('should not filter if the value is NaN', function () {
				var result = List.fields.numarr.addFilterToQuery({
					value: NaN,
				});
				demand(result.numarr).be.undefined();
			});

			it('should not filter between two numbers if one is NaN', function () {
				var result = List.fields.numarr.addFilterToQuery({
					mode: 'between',
					value: {
						min: NaN,
						max: 10,
					},
				});
				demand(result.numarr).be.undefined();
			});
		});
	});

	/* Deprecated inputIsValid tests */

	it('should validate input', function () {
		demand(List.fields.numarr.inputIsValid({
			numarr: [1],
		})).be.true();
		demand(List.fields.numarr.inputIsValid({
			numarr: [1, 2],
		})).be.true();
	});

	it('should validate no input', function () {
		var testItem = new List.model();
		demand(List.fields.numarr.inputIsValid({})).be.true();
		demand(List.fields.numarr.inputIsValid({}, true)).be.false();
		testItem.numarr = [1];
		demand(List.fields.numarr.inputIsValid({}, true, testItem)).be.true();
	});

	it('should validate length when required', function () {
		demand(List.fields.numarr.inputIsValid({
			numarr: [],
		}, true)).be.false();
	});

	it('should validate arrays with numeric string values', function () {
		demand(List.fields.numarr.inputIsValid({
			numarr: ['1'],
		})).be.true();
	});

	it('should invalidate arrays with non-numeric string values', function () {
		demand(List.fields.numarr.inputIsValid({
			numarr: ['a'],
		})).be.false();
	});

	it('should invalidate arrays with complex values', function () {
		demand(List.fields.numarr.inputIsValid({
			numarr: [[]],
		}, true)).be.false();
	});
};
