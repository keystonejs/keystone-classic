var demand = require('must');
var NameType = require('../NameType');

exports.initList = function (List) {
	List.add({
		name: NameType,
	});
};

exports.testFieldType = function (List) {
	describe('updateItem', function () {
		it('should update the full name', function (done) {
			var testItem = new List.model();
			List.fields.name.updateItem(testItem, {
				name: 'Max Mustermann',
			}, function () {
				demand(testItem.name.full).be('Max Mustermann');
				done();
			});
		});

		it('should update the first name', function (done) {
			var testItem = new List.model();
			List.fields.name.updateItem(testItem, {
				name: {
					first: 'Max',
				},
			}, function () {
				demand(testItem.name.first).be('Max');
				done();
			});
		});

		it('should update the last name', function (done) {
			var testItem = new List.model();
			List.fields.name.updateItem(testItem, {
				name: {
					last: 'Max',
				},
			}, function () {
				demand(testItem.name.last).be('Max');
				done();
			});
		});
	});

	describe('validateInput', function () {
		it('should validate string input', function (done) {
			List.fields.name.validateInput({
				name: 'Max',
			}, function (result) {
				demand(result).be.true();
				done();
			});
		});

		it('should validate empty string input', function (done) {
			List.fields.name.validateInput({
				name: '',
			}, function (result) {
				demand(result).be.true();
				done();
			});
		});

		it('should validate undefined input', function (done) {
			List.fields.name.validateInput({}, function (result) {
				demand(result).be.true();
				done();
			});
		});

		it('should validate null input', function (done) {
			List.fields.name.validateInput({
				name: null,
			}, function (result) {
				demand(result).be.true();
				done();
			});
		});

		it('should invalidate numeric input', function (done) {
			List.fields.name.validateInput({
				name: 1,
			}, function (result) {
				demand(result).be.false();
				done();
			});
		});

		it('should invalidate object input', function (done) {
			List.fields.name.validateInput({
				name: { things: 'stuff' },
			}, function (result) {
				demand(result).be.false();
				done();
			});
		});

		it('should invalidate array input', function (done) {
			List.fields.name.validateInput({
				name: [1, 2, 3],
			}, function (result) {
				demand(result).be.false();
				done();
			});
		});

		it('should invalidate Boolean input', function (done) {
			List.fields.name.validateInput({
				name: true,
			}, function (result) {
				demand(result).be.false();
				done();
			});
		});

		it('should invalidate function input', function (done) {
			List.fields.name.validateInput({
				name: function () {},
			}, function (result) {
				demand(result).be.false();
				done();
			});
		});

		it('should invalidate regexp input', function (done) {
			List.fields.name.validateInput({
				name: /foo/,
			}, function (result) {
				demand(result).be.false();
				done();
			});
		});

		it('should invalidate date input', function (done) {
			List.fields.name.validateInput({
				name: new Date(),
			}, function (result) {
				demand(result).be.false();
				done();
			});
		});

		describe('first name', function () {
			it('should validate string input', function (done) {
				List.fields.name.validateInput({
					name_first: 'Max',
				}, function (result) {
					demand(result).be.true();
					done();
				});
			});

			it('should validate dot notation', function (done) {
				List.fields.name.validateInput({
					'name.first': 'Max',
				}, function (result) {
					demand(result).be.true();
					done();
				});
			});

			it('should validate nested object', function (done) {
				List.fields.name.validateInput({
					name: {
						first: 'Max',
					},
				}, function (result) {
					demand(result).be.true();
					done();
				});
			});

			it('should validate empty string input', function (done) {
				List.fields.name.validateInput({
					name_first: '',
				}, function (result) {
					demand(result).be.true();
					done();
				});
			});

			it('should validate undefined input', function (done) {
				List.fields.name.validateInput({}, function (result) {
					demand(result).be.true();
					done();
				});
			});

			it('should validate null input', function (done) {
				List.fields.name.validateInput({
					name_first: null,
				}, function (result) {
					demand(result).be.true();
					done();
				});
			});

			it('should invalidate numeric input', function (done) {
				List.fields.name.validateInput({
					name_first: 1,
				}, function (result) {
					demand(result).be.false();
					done();
				});
			});

			it('should invalidate object input', function (done) {
				List.fields.name.validateInput({
					name_first: { things: 'stuff' },
				}, function (result) {
					demand(result).be.false();
					done();
				});
			});

			it('should invalidate array input', function (done) {
				List.fields.name.validateInput({
					name_first: [1, 2, 3],
				}, function (result) {
					demand(result).be.false();
					done();
				});
			});

			it('should invalidate Boolean input', function (done) {
				List.fields.name.validateInput({
					name_first: true,
				}, function (result) {
					demand(result).be.false();
					done();
				});
			});

			it('should invalidate function input', function (done) {
				List.fields.name.validateInput({
					name_first: function () {},
				}, function (result) {
					demand(result).be.false();
					done();
				});
			});

			it('should invalidate regexp input', function (done) {
				List.fields.name.validateInput({
					name_first: /foo/,
				}, function (result) {
					demand(result).be.false();
					done();
				});
			});

			it('should invalidate date input', function (done) {
				List.fields.name.validateInput({
					name_first: Date.now(),
				}, function (result) {
					demand(result).be.false();
					done();
				});
			});
		});

		describe('last name', function () {
			it('should validate string input', function (done) {
				List.fields.name.validateInput({
					name_last: 'Max',
				}, function (result) {
					demand(result).be.true();
					done();
				});
			});

			it('should validate dot notation', function (done) {
				List.fields.name.validateInput({
					'name.last': 'Max',
				}, function (result) {
					demand(result).be.true();
					done();
				});
			});

			it('should validate nested object', function (done) {
				List.fields.name.validateInput({
					name: {
						last: 'Max',
					},
				}, function (result) {
					demand(result).be.true();
					done();
				});
			});

			it('should validate empty string input', function (done) {
				List.fields.name.validateInput({
					name_last: '',
				}, function (result) {
					demand(result).be.true();
					done();
				});
			});

			it('should validate undefined input', function (done) {
				List.fields.name.validateInput({}, function (result) {
					demand(result).be.true();
					done();
				});
			});

			it('should validate null input', function (done) {
				List.fields.name.validateInput({
					name_last: null,
				}, function (result) {
					demand(result).be.true();
					done();
				});
			});

			it('should invalidate numeric input', function (done) {
				List.fields.name.validateInput({
					name_last: 1,
				}, function (result) {
					demand(result).be.false();
					done();
				});
			});

			it('should invalidate object input', function (done) {
				List.fields.name.validateInput({
					name_last: { things: 'stuff' },
				}, function (result) {
					demand(result).be.false();
					done();
				});
			});

			it('should invalidate array input', function (done) {
				List.fields.name.validateInput({
					name_last: [1, 2, 3],
				}, function (result) {
					demand(result).be.false();
					done();
				});
			});

			it('should invalidate Boolean input', function (done) {
				List.fields.name.validateInput({
					name_last: true,
				}, function (result) {
					demand(result).be.false();
					done();
				});
			});

			it('should invalidate function input', function (done) {
				List.fields.name.validateInput({
					name_last: function () {},
				}, function (result) {
					demand(result).be.false();
					done();
				});
			});

			it('should invalidate regexp input', function (done) {
				List.fields.name.validateInput({
					name_last: /foo/,
				}, function (result) {
					demand(result).be.false();
					done();
				});
			});

			it('should invalidate date input', function (done) {
				List.fields.name.validateInput({
					name_last: new Date(),
				}, function (result) {
					demand(result).be.false();
					done();
				});
			});
		});
	});

	describe('validateRequiredInput', function () {
		it('should validate input present', function (done) {
			var testItem = new List.model();
			List.fields.name.validateRequiredInput(testItem, {
				name: 'Max',
			}, function (result) {
				demand(result).be.true();
				done();
			});
		});

		it('should invalidate undefined', function (done) {
			var testItem = new List.model();
			List.fields.name.validateRequiredInput(testItem, {
				name: undefined,
			}, function (result) {
				demand(result).be.false();
				done();
			});
		});

		it('should validate undefined if a previous value exists', function (done) {
			var testItem = new List.model({
				'name.first': 'Max',
			});
			List.fields.name.validateRequiredInput(testItem, {
				name: undefined,
			}, function (result) {
				demand(result).be.true();
				done();
			});
		});

		it('should invalidate empty string', function (done) {
			var testItem = new List.model();
			List.fields.name.validateRequiredInput(testItem, {
				name: '',
			}, function (result) {
				demand(result).be.false();
				done();
			});
		});

		it('should invalidate null', function (done) {
			var testItem = new List.model();
			List.fields.name.validateRequiredInput(testItem, {
				name: null,
			}, function (result) {
				demand(result).be.false();
				done();
			});
		});

		describe('first name', function () {
			it('should validate input present', function (done) {
				var testItem = new List.model();
				List.fields.name.validateRequiredInput(testItem, {
					name_first: 'Max',
				}, function (result) {
					demand(result).be.true();
					done();
				});
			});

			it('should invalidate undefined', function (done) {
				var testItem = new List.model();
				List.fields.name.validateRequiredInput(testItem, {
					name_first: undefined,
				}, function (result) {
					demand(result).be.false();
					done();
				});
			});

			it('should validate undefined if a previous value exists', function (done) {
				var testItem = new List.model({
					'name.first': 'Max',
				});
				List.fields.name.validateRequiredInput(testItem, {
					name_first: undefined,
				}, function (result) {
					demand(result).be.true();
					done();
				});
			});

			it('should invalidate empty string', function (done) {
				var testItem = new List.model();
				List.fields.name.validateRequiredInput(testItem, {
					name_first: '',
				}, function (result) {
					demand(result).be.false();
					done();
				});
			});

			it('should invalidate null', function (done) {
				var testItem = new List.model();
				List.fields.name.validateRequiredInput(testItem, {
					name_first: null,
				}, function (result) {
					demand(result).be.false();
					done();
				});
			});
		});

		describe('last name', function () {
			it('should validate input present', function (done) {
				var testItem = new List.model();
				List.fields.name.validateRequiredInput(testItem, {
					name_last: 'Max',
				}, function (result) {
					demand(result).be.true();
					done();
				});
			});

			it('should invalidate undefined', function (done) {
				var testItem = new List.model();
				List.fields.name.validateRequiredInput(testItem, {
					name_last: undefined,
				}, function (result) {
					demand(result).be.false();
					done();
				});
			});

			it('should validate undefined if a previous value exists', function (done) {
				var testItem = new List.model({
					'name.last': 'Max',
				});
				List.fields.name.validateRequiredInput(testItem, {
					name_last: undefined,
				}, function (result) {
					demand(result).be.true();
					done();
				});
			});

			it('should invalidate empty string', function (done) {
				var testItem = new List.model();
				List.fields.name.validateRequiredInput(testItem, {
					name_last: '',
				}, function (result) {
					demand(result).be.false();
					done();
				});
			});

			it('should invalidate null', function (done) {
				var testItem = new List.model();
				List.fields.name.validateRequiredInput(testItem, {
					name_last: null,
				}, function (result) {
					demand(result).be.false();
					done();
				});
			});
		});
	});

	describe('addFilterToQuery', function () {
		it('should return a regex with the "i" flag set', function () {
			var result = List.fields.name.addFilterToQuery({
				value: 'abc',
			});

			demand(result.$or[0]).eql({
				'name.first': /abc/i,
			});
			demand(result.$or[1]).eql({
				'name.last': /abc/i,
			});
		});

		it('should allow case sensitive matching', function () {
			var result = List.fields.name.addFilterToQuery({
				value: 'abc',
				caseSensitive: true,
			});

			demand(result.$or[0]).eql({
				'name.first': /abc/,
			});
			demand(result.$or[1]).eql({
				'name.last': /abc/,
			});
		});

		it('should allow inverted matching', function () {
			var result = List.fields.name.addFilterToQuery({
				value: 'abc',
				inverted: true,
			});
			demand(result['name.first']).eql({
				$not: /abc/i,
			});
			demand(result['name.last']).eql({
				$not: /abc/i,
			});
		});

		it('should allow exact matching', function () {
			var result = List.fields.name.addFilterToQuery({
				value: 'abc',
				mode: 'exactly',
			});
			demand(result.$or[0]).eql({
				'name.first': /^abc$/i,
			});
			demand(result.$or[1]).eql({
				'name.last': /^abc$/i,
			});
		});

		it('should allow matching the end', function () {
			var result = List.fields.name.addFilterToQuery({
				value: 'abc',
				mode: 'endsWith',
			});
			demand(result.$or[0]).eql({
				'name.first': /abc$/i,
			});
			demand(result.$or[1]).eql({
				'name.last': /abc$/i,
			});
		});

		it('should allow matching the start', function () {
			var result = List.fields.name.addFilterToQuery({
				value: 'abc',
				mode: 'beginsWith',
			});
			demand(result.$or[0]).eql({
				'name.first': /^abc/i,
			});
			demand(result.$or[1]).eql({
				'name.last': /^abc/i,
			});
		});

		it('should allow matching empty values in exact mode', function () {
			var result = List.fields.name.addFilterToQuery({
				mode: 'exactly',
			});
			demand(result['name.first']).eql({
				$in: ['', null],
			});
			demand(result['name.last']).eql({
				$in: ['', null],
			});
		});

		it('should allow matching non-empty values in exact mode with the inverted option', function () {
			var result = List.fields.name.addFilterToQuery({
				mode: 'exactly',
				inverted: true,
			});
			demand(result['name.first']).eql({
				$nin: ['', null],
			});
			demand(result['name.last']).eql({
				$nin: ['', null],
			});
		});
	});
};
