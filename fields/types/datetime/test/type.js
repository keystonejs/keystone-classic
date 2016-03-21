var demand = require('must');
var TextType = require('../../text/TextType');
var DateType = require('../../date/DateType');
var DatetimeType = require('../DatetimeType');

exports.initList = function (List) {
	List.add({
		datetime: DatetimeType,
		nested: {
			datetime: DatetimeType,
		},
	});
};

exports.testFieldType = function (List) {
	var testItem = new List.model();

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

		it('should not accept invalid values', function (done) {
			var testItem = new List.model();
			testItem.datetime = '2015-01-01 01:01:01 am';
			List.fields.datetime.updateItem(testItem, {
				datetime: 'somestring',
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

	it('should use the date input validator', function () {
		demand(List.fields.datetime.validateInput === DateType.prototype.validateInput);
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
