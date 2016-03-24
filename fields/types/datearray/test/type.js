var demand = require('must');
var DateArrayType = require('../DateArrayType');

exports.initList = function (List) {
	List.add({
		datearr: { type: DateArrayType },
		nested: {
			datearr: { type: DateArrayType },
		},
	});
};

exports.testFieldType = function (List) {
	describe('invalid options', function () {
		it('should throw when format is not a string', function (done) {
			try {
				List.add({
					invalidFormatOption: { type: DateArrayType, format: /aregexp/ },
				});
			} catch (err) {
				demand(err.message).eql('FieldType.DateArray: options.format must be a string.');
				done();
			}
		});
	});

	it('should default to an empty array', function () {
		var testItem = new List.model();
		demand(testItem.get('datearr')).eql([]);
	});

	describe('validateInput', function () {
		it('should validate top level fields', function (done) {
			List.fields.datearr.validateInput({
				datearr: ['2015-03-03', '2015-03-04'],
			}, function (result) {
				demand(result).be.true();
				done();
			});
		});

		it('should validate nested fields', function (done) {
			List.fields['nested.datearr'].validateInput({
				nested: {
					datearr: ['2015-03-03', '2015-03-04'],
				},
			}, function (result) {
				demand(result).be.true();
				done();
			});
		});

		it('should validate nested fields with flat paths', function (done) {
			List.fields['nested.datearr'].validateInput({
				'nested.datearr': ['2015-03-03', '2015-03-04'],
			}, function (result) {
				demand(result).be.true();
				done();
			});
		});

		it('should validate an epoch number', function (done) {
			List.fields.datearr.validateInput({
				datearr: [1458162309111],
			}, function (result) {
				demand(result).be.true();
				done();
			});
		});

		// A single string will be coerced to an array, so we let it pass
		it('should validate a date string', function (done) {
			List.fields.datearr.validateInput({
				datearr: '2015-03-03',
			}, function (result) {
				demand(result).be.true();
				done();
			});
		});

		// A single string will be coerced to an array, so we let it pass
		it('should validate an epoch number without an array', function (done) {
			List.fields.datearr.validateInput({
				datearr: 1458162309111,
			}, function (result) {
				demand(result).be.true();
				done();
			});
		});

		// An empty array clears the value, so we let it pass
		it('should validate an empty array', function (done) {
			List.fields.datearr.validateInput({
				datearr: [],
			}, function (result) {
				demand(result).be.true();
				done();
			});
		});

		// A blank string clears the value, so we let it pass
		it('should validate a blank string', function (done) {
			List.fields.datearr.validateInput({
				datearr: '',
			}, function (result) {
				demand(result).be.true();
				done();
			});
		});

		// null clears the value, so we let it pass
		it('should validate null', function (done) {
			List.fields.datearr.validateInput({
				datearr: null,
			}, function (result) {
				demand(result).be.true();
				done();
			});
		});

		// undefined doesn't change anything, so we let it pass
		it('should validate undefined', function (done) {
			List.fields.datearr.validateInput({
				datearr: undefined,
			}, function (result) {
				demand(result).be.true();
				done();
			});
		});

		it('should invalidate false', function (done) {
			List.fields.datearr.validateInput({
				datearr: false,
			}, function (result) {
				demand(result).be.false();
				done();
			});
		});

		it('should invalidate true', function (done) {
			List.fields.datearr.validateInput({
				datearr: true,
			}, function (result) {
				demand(result).be.false();
				done();
			});
		});

		it('should invalidate a random string', function (done) {
			List.fields.datearr.validateInput({
				datearr: 'aaa',
			}, function (result) {
				demand(result).be.false();
				done();
			});
		});

		it('should invalidate an array with a random string', function (done) {
			List.fields.datearr.validateInput({
				datearr: ['aaa'],
			}, function (result) {
				demand(result).be.false();
				done();
			});
		});

		it('should invalidate an array with a string somewhere', function (done) {
			List.fields.datearr.validateInput({
				datearr: ['2015-03-03', '2015-03-04', 'aaa'],
			}, function (result) {
				demand(result).be.false();
				done();
			});
		});
	});

	describe('validateRequiredInput', function () {
		it('should validate an array of dates', function (done) {
			var testItem = new List.model();
			List.fields.datearr.validateRequiredInput(testItem, {
				datearr: ['2015-01-01', '2015-01-02'],
			}, function (result) {
				demand(result).be.true();
				done();
			});
		});

		it('should validate a date', function (done) {
			var testItem = new List.model();
			List.fields.datearr.validateRequiredInput(testItem, {
				datearr: '2015-01-01',
			}, function (result) {
				demand(result).be.true();
				done();
			});
		});

		it('should validate a nested array of dates', function (done) {
			var testItem = new List.model();
			List.fields['nested.datearr'].validateRequiredInput(testItem, {
				nested: {
					datearr: ['2015-01-01', '2015-01-02'],
				},
			}, function (result) {
				demand(result).be.true();
				done();
			});
		});

		it('should validate a nested array of numbers with a flat paths', function (done) {
			List.fields.datearr.validateInput({
				'nested.datearr': ['2015-01-01', '2015-01-02'],
			}, function (result) {
				demand(result).be.true();
				done();
			});
		});

		it('should invalidate an empty string', function (done) {
			var testItem = new List.model();
			List.fields.datearr.validateRequiredInput(testItem, {
				datearr: '',
			}, function (result) {
				demand(result).be.false();
				done();
			});
		});

		it('should invalidate undefined', function (done) {
			var testItem = new List.model();
			List.fields.datearr.validateRequiredInput(testItem, {
				datearr: undefined,
			}, function (result) {
				demand(result).be.false();
				done();
			});
		});

		it('should validate undefined if a value exists', function (done) {
			var testItem = new List.model({
				datearr: ['2015-01-01'],
			});
			List.fields.datearr.validateRequiredInput(testItem, {
				datearr: undefined,
			}, function (result) {
				demand(result).be.true();
				done();
			});
		});

		it('should invalidate null', function (done) {
			var testItem = new List.model();
			List.fields.datearr.validateRequiredInput(testItem, {
				datearr: null,
			}, function (result) {
				demand(result).be.false();
				done();
			});
		});

		it('should invalidate an array with an empty string', function (done) {
			var testItem = new List.model();
			List.fields.datearr.validateRequiredInput(testItem, {
				datearr: [''],
			}, function (result) {
				demand(result).be.false();
				done();
			});
		});

		it('should invalidate an array with empty strings', function (done) {
			var testItem = new List.model();
			List.fields.datearr.validateRequiredInput(testItem, {
				datearr: ['2015-01-01', '', '2015-01-02'],
			}, function (result) {
				demand(result).be.false();
				done();
			});
		});
	});

	describe('updateItem', function () {
		it('should update top level fields', function (done) {
			var testItem = new List.model();
			List.fields.datearr.updateItem(testItem, {
				datearr: ['2015-01-01', '2015-01-02', '2015-01-03', '2015-01-04'],
			}, function () {
				demand(testItem.datearr).eql([new Date('2015-01-01'), new Date('2015-01-02'), new Date('2015-01-03'), new Date('2015-01-04')]);
				done();
			});
		});

		it('should update nested fields', function (done) {
			var testItem = new List.model();
			List.fields['nested.datearr'].updateItem(testItem, {
				nested: {
					datearr: ['2015-01-01', '2015-01-02', '2015-01-03', '2015-01-04'],
				},
			}, function () {
				demand(testItem.nested.datearr).eql([new Date('2015-01-01'), new Date('2015-01-02'), new Date('2015-01-03'), new Date('2015-01-04')]);
				done();
			});
		});

		it('should update nested fields with flat paths', function (done) {
			var testItem = new List.model();
			List.fields['nested.datearr'].updateItem(testItem, {
				'nested.datearr': ['2015-01-01', '2015-01-02', '2015-01-03', '2015-01-04'],
			}, function () {
				demand(testItem.nested.datearr).eql([new Date('2015-01-01'), new Date('2015-01-02'), new Date('2015-01-03'), new Date('2015-01-04')]);
				testItem.nested.datearr = undefined;
				done();
			});
		});

		it('should update empty arrays', function (done) {
			var testItem = new List.model();
			List.fields.datearr.updateItem(testItem, {
				datearr: [],
			}, function () {
				demand(testItem.datearr).eql([]);
				done();
			});
		});

		it('should default on null', function (done) {
			var testItem = new List.model();
			List.fields.datearr.updateItem(testItem, {
				datearr: null,
			}, function () {
				demand(testItem.datearr).eql([]);
				done();
			});
		});

		it('should allow a single date value', function (done) {
			var testItem = new List.model();
			List.fields.datearr.updateItem(testItem, {
				datearr: '2015-01-01',
			}, function () {
				demand(testItem.datearr).eql([new Date('2015-01-01')]);
				done();
			});
		});
	});

	/* Deprecated inputIsValid tests */

	it('should validate input', function () {
		demand(List.fields.datearr.inputIsValid({
			datearr: '2015-03-03',
		})).be.true();
		demand(List.fields.datearr.inputIsValid({
			datearr: ['2015-03-03'],
		})).be.true();
		demand(List.fields.datearr.inputIsValid({
			datearr: ['2015-03-03', '2015-03-04'],
		})).be.true();
	});

	it('should validate no input', function () {
		var testItem = new List.model();
		demand(List.fields.datearr.inputIsValid({})).be.true();
		demand(List.fields.datearr.inputIsValid({}, true)).be.false();
		testItem.datearr = ['2015-03-03'];
		demand(List.fields.datearr.inputIsValid({}, true, testItem)).be.true();
	});

	it('should validate length when required', function () {
		demand(List.fields.datearr.inputIsValid({
			datearr: [],
		}, true)).be.false();
	});

	it('should invalidate arrays with invalid dates', function () {
		demand(List.fields.datearr.inputIsValid({
			datearr: 'not a real date',
		})).be.false();
		demand(List.fields.datearr.inputIsValid({
			datearr: ['2001-01-35'],
		})).be.false();
		demand(List.fields.datearr.inputIsValid({
			datearr: ['35-34-3210', '2001-01-01'],
		})).be.false();
	});
};
