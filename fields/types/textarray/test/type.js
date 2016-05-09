var demand = require('must');
var TextArrayType = require('../TextArrayType');

exports.initList = function (List) {
	List.add({
		textarr: TextArrayType,
		nested: {
			textarr: TextArrayType,
		},
		customSeparator: { type: TextArrayType, separator: ' * ' },
	});
};

exports.testFieldType = function (List) {
	it('should default to an empty array', function () {
		var testItem = new List.model();
		demand(testItem.get('textarr')).eql([]);
	});

	describe('validateInput', function () {
		it('should validate top level fields', function (done) {
			List.fields.textarr.validateInput({
				textarr: ['a', 'b'],
			}, function (result) {
				demand(result).be.true();
				done();
			});
		});

		it('should validate nested fields', function (done) {
			List.fields.textarr.validateInput({
				nested: {
					textarr: ['a', 'b'],
				},
			}, function (result) {
				demand(result).be.true();
				done();
			});
		});

		it('should validate nested fields with flat paths', function (done) {
			List.fields.textarr.validateInput({
				'nested.textarr': ['a', 'b'],
			}, function (result) {
				demand(result).be.true();
				done();
			});
		});

		// A single string will be coerced to an array, so we let it pass
		it('should validate a single string value', function (done) {
			List.fields.textarr.validateInput({
				textarr: 'a',
			}, function (result) {
				demand(result).be.true();
				done();
			});
		});

		// An empty array clears the value, so we let it pass
		it('should validate an empty array', function (done) {
			List.fields.textarr.validateInput({ textarr: [] }, function (result) {
				demand(result).be.true();
				done();
			});
		});

		// A blank string clears the value, so we let it pass
		it('should validate a blank string', function (done) {
			List.fields.textarr.validateInput({ textarr: '' }, function (result) {
				demand(result).be.true();
				done();
			});
		});

		// null clears the value, so we let it pass
		it('should validate null', function (done) {
			List.fields.textarr.validateInput({ textarr: null }, function (result) {
				demand(result).be.true();
				done();
			});
		});

		// undefined doesn't change anything, so we let it pass
		it('should validate undefined', function (done) {
			List.fields.textarr.validateInput({
				textarr: undefined,
			}, function (result) {
				demand(result).be.true();
				done();
			});
		});

		it('should invalidate false', function (done) {
			List.fields.textarr.validateInput({ textarr: false }, function (result) {
				demand(result).be.false();
				done();
			});
		});

		it('should invalidate true', function (done) {
			List.fields.textarr.validateInput({ textarr: true }, function (result) {
				demand(result).be.false();
				done();
			});
		});

		it('should invalidate a number', function (done) {
			List.fields.textarr.validateInput({ textarr: 1 }, function (result) {
				demand(result).be.false();
				done();
			});
		});

		it('should invalidate an array of numbers', function (done) {
			List.fields.textarr.validateInput({
				textarr: [1, 2, 3],
			}, function (result) {
				demand(result).be.false();
				done();
			});
		});

		it('should invalidate an array with a numbers', function (done) {
			List.fields.textarr.validateInput({
				textarr: ['a', 2, 'b'],
			}, function (result) {
				demand(result).be.false();
				done();
			});
		});
	});

	describe('validateRequiredInput', function () {
		it('should validate an array of strings', function (done) {
			var testItem = new List.model();
			List.fields.textarr.validateRequiredInput(testItem, {
				textarr: ['a', 'b'],
			}, function (result) {
				demand(result).be.true();
				done();
			});
		});

		it('should validate a nested array of strings', function (done) {
			var testItem = new List.model();
			List.fields['nested.textarr'].validateRequiredInput(testItem, {
				nested: {
					textarr: ['a', 'b'],
				},
			}, function (result) {
				demand(result).be.true();
				done();
			});
		});

		it('should validate a nested array of strings with a flat paths', function (done) {
			List.fields.textarr.validateInput({
				'nested.textarr': ['a', 'b'],
			}, function (result) {
				demand(result).be.true();
				done();
			});
		});

		it('should invalidate an empty string', function (done) {
			var testItem = new List.model();
			List.fields.textarr.validateRequiredInput(testItem, {
				textarr: '',
			}, function (result) {
				demand(result).be.false();
				done();
			});
		});

		it('should invalidate undefined', function (done) {
			var testItem = new List.model();
			List.fields.textarr.validateRequiredInput(testItem, {
				textarr: undefined,
			}, function (result) {
				demand(result).be.false();
				done();
			});
		});

		it('should validate undefined if a value exists', function (done) {
			var testItem = new List.model({
				textarr: ['a'],
			});
			List.fields.textarr.validateRequiredInput(testItem, {
				textarr: undefined,
			}, function (result) {
				demand(result).be.true();
				done();
			});
		});

		it('should invalidate null', function (done) {
			var testItem = new List.model();
			List.fields.textarr.validateRequiredInput(testItem, {
				textarr: null,
			}, function (result) {
				demand(result).be.false();
				done();
			});
		});

		it('should invalidate an array with an empty string', function (done) {
			var testItem = new List.model();
			List.fields.textarr.validateRequiredInput(testItem, {
				textarr: [''],
			}, function (result) {
				demand(result).be.false();
				done();
			});
		});

		it('should invalidate an array with empty strings', function (done) {
			var testItem = new List.model();
			List.fields.textarr.validateRequiredInput(testItem, {
				textarr: ['a', 'b', ''],
			}, function (result) {
				demand(result).be.false();
				done();
			});
		});
	});

	describe('updateItem', function () {
		it('should update top level fields', function (done) {
			var testItem = new List.model();
			List.fields.textarr.updateItem(testItem, {
				textarr: ['a', 'b'],
			}, function () {
				demand(testItem.textarr).eql(['a', 'b']);
				done();
			});
		});

		it('should update nested fields', function (done) {
			var testItem = new List.model();
			List.fields['nested.textarr'].updateItem(testItem, {
				nested: {
					textarr: ['a', 'b'],
				},
			}, function () {
				demand(testItem.nested.textarr).eql(['a', 'b']);
				done();
			});
		});

		it('should update nested fields with flat paths', function (done) {
			var testItem = new List.model();
			List.fields['nested.textarr'].updateItem(testItem, {
				'nested.textarr': ['a', 'b'],
			}, function () {
				demand(testItem.nested.textarr).eql(['a', 'b']);
				done();
			});
		});

		it('should update nested fields non-empty arrays to empty arrays when the data is empty', function (done) {
			var testItem = new List.model();
			List.fields['nested.textarr'].updateItem(testItem, {
				'nested.textarr': ['a', 'b'],
			}, function () {
				List.fields['nested.textarr'].updateItem(testItem, {}, function () {
					demand(testItem.nested.textarr).eql([]);
					done();
				});
			});
		});

		it('should update non-empty arrays to empty arrays when the data is empty', function (done) {
			var testItem = new List.model();
			List.fields.textarr.updateItem(testItem, {
				textarr: ['a', 'b'],
			}, function () {
				List.fields.textarr.updateItem(testItem, {}, function () {
					demand(testItem.textarr).eql([]);
					done();
				});
			});
		});

		it('should update empty arrays', function (done) {
			var testItem = new List.model();
			List.fields.textarr.updateItem(testItem, {
				textarr: [],
			}, function () {
				demand(testItem.textarr).eql([]);
				done();
			});
		});

		it('should default on null', function (done) {
			var testItem = new List.model();
			List.fields.textarr.updateItem(testItem, {
				textarr: null,
			}, function () {
				demand(testItem.textarr).eql([]);
				done();
			});
		});

		it('should allow a single string value', function (done) {
			var testItem = new List.model();
			List.fields.textarr.updateItem(testItem, {
				textarr: 'a',
			}, function () {
				demand(testItem.textarr).eql(['a']);
				done();
			});
		});

		it('should convert truthy values with toString methods to strings', function (done) {
			var testItem = new List.model();
			var time = new Date();
			List.fields.textarr.updateItem(testItem, {
				textarr: [1, 'a', true, false, null, undefined, [], {}, time],
			}, function () {
				demand(testItem.textarr).eql(['1', 'a', 'true', '[object Object]', String(time)]);
				done();
			});
		});
	});

	describe('addFilterToQuery', function () {
		describe('"some" present', function () {
			it('should return a regex with the "i" flag set', function () {
				var result = List.fields.textarr.addFilterToQuery({
					presence: 'some',
					value: 'abc',
				});
				demand(result.textarr).eql({
					$elemMatch: {
						$regex: /abc/i,
					},
				});
			});

			it('should allow case sensitive matching', function () {
				var result = List.fields.textarr.addFilterToQuery({
					presence: 'some',
					value: 'abc',
					caseSensitive: true,
				});
				demand(result.textarr).eql({
					$elemMatch: {
						$regex: /abc/,
					},
				});
			});

			it('should allow exact matching', function () {
				var result = List.fields.textarr.addFilterToQuery({
					presence: 'some',
					value: 'abc',
					mode: 'exactly',
				});
				demand(result.textarr).eql({
					$elemMatch: {
						$regex: /^abc$/i,
					},
				});
			});

			it('should allow matching the end', function () {
				var result = List.fields.textarr.addFilterToQuery({
					presence: 'some',
					value: 'abc',
					mode: 'endsWith',
				});
				demand(result.textarr).eql({
					$elemMatch: {
						$regex: /abc$/i,
					},
				});
			});

			it('should allow matching the start', function () {
				var result = List.fields.textarr.addFilterToQuery({
					presence: 'some',
					value: 'abc',
					mode: 'beginsWith',
				});
				demand(result.textarr).eql({
					$elemMatch: {
						$regex: /^abc/i,
					},
				});
			});

			it('should allow matching empty values', function () {
				var result = List.fields.textarr.addFilterToQuery({
					presence: 'some',
				});
				demand(result.textarr).eql({
					$size: 0,
				});
			});
		});

		describe('"none" present', function () {
			it('should return a regex with the "i" flag set', function () {
				var result = List.fields.textarr.addFilterToQuery({
					presence: 'none',
					value: 'abc',
				});
				demand(result.textarr).eql({
					$not: /abc/i,
				});
			});

			it('should allow case sensitive matching', function () {
				var result = List.fields.textarr.addFilterToQuery({
					presence: 'none',
					value: 'abc',
					caseSensitive: true,
				});
				demand(result.textarr).eql({
					$not: /abc/,
				});
			});

			it('should allow exact matching', function () {
				var result = List.fields.textarr.addFilterToQuery({
					presence: 'none',
					value: 'abc',
					mode: 'exactly',
				});
				demand(result.textarr).eql({
					$not: /^abc$/i,
				});
			});

			it('should allow matching the end', function () {
				var result = List.fields.textarr.addFilterToQuery({
					presence: 'none',
					value: 'abc',
					mode: 'endsWith',
				});
				demand(result.textarr).eql({
					$not: /abc$/i,
				});
			});

			it('should allow matching the start', function () {
				var result = List.fields.textarr.addFilterToQuery({
					presence: 'none',
					value: 'abc',
					mode: 'beginsWith',
				});
				demand(result.textarr).eql({
					$not: /^abc/i,
				});
			});

			it('should allow matching non-empty values', function () {
				var result = List.fields.textarr.addFilterToQuery({
					presence: 'none',
				});
				demand(result.textarr).eql({
					$not: {
						$size: 0,
					},
				});
			});
		});

		// Presence undefined should behave exactly like presence === 'some'
		describe('no presence option', function () {
			it('should return a regex with the "i" flag set', function () {
				var result = List.fields.textarr.addFilterToQuery({
					value: 'abc',
				});
				demand(result.textarr).eql({
					$elemMatch: {
						$regex: /abc/i,
					},
				});
			});

			it('should allow case sensitive matching', function () {
				var result = List.fields.textarr.addFilterToQuery({
					value: 'abc',
					caseSensitive: true,
				});
				demand(result.textarr).eql({
					$elemMatch: {
						$regex: /abc/,
					},
				});
			});

			it('should allow exact matching', function () {
				var result = List.fields.textarr.addFilterToQuery({
					value: 'abc',
					mode: 'exactly',
				});
				demand(result.textarr).eql({
					$elemMatch: {
						$regex: /^abc$/i,
					},
				});
			});

			it('should allow matching the end', function () {
				var result = List.fields.textarr.addFilterToQuery({
					value: 'abc',
					mode: 'endsWith',
				});
				demand(result.textarr).eql({
					$elemMatch: {
						$regex: /abc$/i,
					},
				});
			});

			it('should allow matching the start', function () {
				var result = List.fields.textarr.addFilterToQuery({
					value: 'abc',
					mode: 'beginsWith',
				});
				demand(result.textarr).eql({
					$elemMatch: {
						$regex: /^abc/i,
					},
				});
			});

			it('should allow matching empty values in exact mode', function () {
				var result = List.fields.textarr.addFilterToQuery({});
				demand(result.textarr).eql({
					$size: 0,
				});
			});
		});
	});

	describe('format', function () {
		it('should use the default separator for formatting', function () {
			var testItem = new List.model({
				textarr: ['one', 'two', 'three'],
			});
			demand(testItem._.textarr.format()).be('one | two | three');
		});

		it('should use the provided separator for formatting', function () {
			var testItem = new List.model({
				textarr: ['one', 'two', 'three'],
			});
			demand(testItem._.textarr.format(', ')).be('one, two, three');
		});

		it('should use the specified separator for formatting', function () {
			var testItem = new List.model({
				customSeparator: ['one', 'two', 'three'],
			});
			demand(testItem._.customSeparator.format()).be('one * two * three');
		});
	});

	/* Deprecated inputIsValid Tests */

	it('should validate input', function () {
		demand(List.fields.textarr.inputIsValid({
			textarr: ['a'],
		})).be.true();
		demand(List.fields.textarr.inputIsValid({
			textarr: ['a', 'b'],
		})).be.true();
	});

	it('should validate no input', function () {
		var testItem = new List.model();
		demand(List.fields.textarr.inputIsValid({})).be.true();
		demand(List.fields.textarr.inputIsValid({}, true)).be.false();
		testItem.textarr = ['a'];
		demand(List.fields.textarr.inputIsValid({}, true, testItem)).be.true();
	});

	it('should validate length when required', function () {
		demand(List.fields.textarr.inputIsValid({
			textarr: [],
		}, true)).be.false();
	});

	it('should invalidate arrays with complex values', function () {
		demand(List.fields.textarr.inputIsValid({
			textarr: [[]],
		}, true)).be.false();
	});
};
