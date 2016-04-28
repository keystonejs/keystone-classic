var demand = require('must');
var TextType = require('../../text/TextType');
var DateType = require('../../date/DateType');
var DatetimeType = require('../DatetimeType');

exports.initList = function (List) {
	List.add({
		datetime: DatetimeType,
		customFormat: {
			type: DatetimeType,
			parseFormat: 'DD.MM.YY h:m a',
		},
		nested: {
			datetime: DatetimeType,
		},
	});
};

exports.testFieldType = function (List) {
	describe('invalid options', function () {
		it('should throw when format is not a string', function (done) {
			try {
				List.add({
					invalidFormatOption: { type: DatetimeType, format: /aregexp/ },
				});
			} catch (err) {
				demand(err.message).eql('FieldType.DateTime: options.format must be a string.');
				done();
			}
		});
	});

	describe('updateItem', function () {
		it('should update the date', function (done) {
			var testItem = new List.model();
			List.fields.datetime.updateItem(testItem, {
				datetime: '2015-01-01 01:01:01 am',
			}, function () {
				demand(testItem.datetime.toDateString()).be('Thu Jan 01 2015');
				done();
			});
		});

		it('should null value with empty string', function (done) {
			var testItem = new List.model();
			testItem.datetime = '2014-12-31T14:01:01.000Z';
			List.fields.datetime.updateItem(testItem, {
				datetime: '',
			}, function () {
				demand(testItem.datetime).be.null();
				done();
			});
		});

		it('should null value when null', function (done) {
			var testItem = new List.model();
			testItem.datetime = '2014-12-31T14:01:01.000Z';
			List.fields.datetime.updateItem(testItem, {
				datetime: null,
			}, function () {
				demand(testItem.datetime).be.null();
				done();
			});
		});

		it('should not null value when undefined', function (done) {
			var testItem = new List.model();
			testItem.datetime = '2015-01-01 01:01:01 am';
			List.fields.datetime.updateItem(testItem, {
				datetime: undefined,
			}, function () {
				demand(testItem.datetime.toDateString()).be('Thu Jan 01 2015');
				done();
			});
		});
	});

	describe('getInputFromData', function () {
		it('should get input from data', function () {
			var value = List.fields.datetime.getInputFromData({
				datetime: '2016-02-25 04:45:00',
			});
			demand(value).to.equal('2016-02-25 04:45:00');
		});

		it('should get nested input from data', function () {
			var value = List.fields['nested.datetime'].getInputFromData({
				nested: { datetime: '2016-02-25 04:45:00' },
			});
			demand(value).to.equal('2016-02-25 04:45:00');
		});

		it('should get flat nested input from data', function () {
			var value = List.fields['nested.datetime'].getInputFromData({
				'nested.datetime': '2016-02-25 04:45:00',
			});
			demand(value).to.equal('2016-02-25 04:45:00');
		});

		it('should get split input from data', function () {
			var value = List.fields.datetime.getInputFromData({
				datetime_date: '2016-02-25',
				datetime_time: '04:45:00',
			});
			demand(value).to.equal('2016-02-25 04:45:00');
		});

		it('should get nested split input from data', function () {
			var value = List.fields['nested.datetime'].getInputFromData({
				nested: {
					datetime_date: '2016-02-25',
					datetime_time: '04:45:00',
				},
			});
			demand(value).to.equal('2016-02-25 04:45:00');
		});

		it('should get flat nested split input from data', function () {
			var value = List.fields['nested.datetime'].getInputFromData({
				'nested.datetime_date': '2016-02-25',
				'nested.datetime_time': '04:45:00',
			});
			demand(value).to.equal('2016-02-25 04:45:00');
		});
	});

	describe('validateInput', function () {
		it('should validate emtpy string input', function (done) {
			List.fields.datetime.validateInput({ datetime: '' }, function (result) {
				demand(result).be.true();
				done();
			});
		});

		it('should validate undefined input', function (done) {
			List.fields.datetime.validateInput({}, function (result) {
				demand(result).be.true();
				done();
			});
		});

		it('should validate null input', function (done) {
			List.fields.datetime.validateInput({ datetime: null }, function (result) {
				demand(result).be.true();
				done();
			});
		});

		it('should validate numeric input', function (done) {
			List.fields.datetime.validateInput({ datetime: 1 }, function (result) {
				demand(result).be.true();
				done();
			});
		});

		it('should validate JS Date input', function (done) {
			List.fields.datetime.validateInput({ datetime: Date.now() }, function (result) {
				demand(result).be.true();
				done();
			});
		});

		it('should validate a date time string in the default format', function (done) {
			List.fields.datetime.validateInput({
				datetime: '2016-02-25 04:45:00 am',
			}, function (result) {
				demand(result).be.true();
				done();
			});
		});

		it('should validate a date time string in a custom format when specified', function (done) {
			List.fields.customFormat.validateInput({
				customFormat: '25.02.16 04:45 am',
			}, function (result) {
				demand(result).be.true();
				done();
			});
		});

		it('should invalidate a date time string in a different format', function (done) {
			List.fields.datetime.validateInput({
				datetime: '25.02.16 04:45 am',
			}, function (result) {
				demand(result).be.false();
				done();
			});
		});

		it('should invalidate a date time string in the default format when a custom one is specified', function (done) {
			List.fields.customFormat.validateInput({
				customFormat: '2016-02-25 04:45:00 am',
			}, function (result) {
				demand(result).be.false();
				done();
			});
		});

		it('should invalidate object input', function (done) {
			List.fields.datetime.validateInput({ datetime: { things: 'stuff' } }, function (result) {
				demand(result).be.false();
				done();
			});
		});

		it('should invalidate array input', function (done) {
			List.fields.datetime.validateInput({ datetime: [1, 2, 3] }, function (result) {
				demand(result).be.false();
				done();
			});
		});

		it('should invalidate Boolean input', function (done) {
			List.fields.datetime.validateInput({ datetime: true }, function (result) {
				demand(result).be.false();
				done();
			});
		});

		it('should invalidate function input', function (done) {
			List.fields.datetime.validateInput({ datetime: function () {} }, function (result) {
				demand(result).be.false();
				done();
			});
		});

		it('should invalidate regexp input', function (done) {
			List.fields.datetime.validateInput({ datetime: /foo/ }, function (result) {
				demand(result).be.false();
				done();
			});
		});
	});

	it('should use the common text required validator', function () {
		demand(List.fields.datetime.validateRequiredInput === TextType.prototype.validateRequiredInput);
	});

	it('should use the date parse method', function () {
		demand(List.fields.datetime.parse === DateType.prototype.parse);
	});

	it('should use the date updateItem method', function () {
		demand(List.fields.datetime.updateItem === DateType.prototype.updateItem);
	});
};
