var demand = require('must');
var DateType = require('../DateType');
var TextType = require('../../text/TextType');
var moment = require('moment');

exports.initList = function (List) {
	List.add({
		date: DateType,
		utcDate: { type: DateType, utc: true },
		utcDateForcedTZ: { type: DateType, utc: true, timezoneUtcOffsetMinutes: 330 },
		nested: {
			date: DateType,
		},
	});
};

exports.testFieldType = function (List) {
	describe('invalid options', function () {
		it('should throw when format is not a string', function (done) {
			try {
				List.add({
					invalidFormatOption: { type: DateType, format: /aregexp/ },
				});
			} catch (err) {
				demand(err.message).eql('FieldType.Date: options.format must be a string.');
				done();
			}
		});
	});

	describe('updateItem', function () {
		it('should normalize dates with moment', function (done) {
			var testItem = new List.model();
			List.fields.date.updateItem(testItem, {
				date: '2015-01-01',
			}, function () {
				demand(testItem.date).eql(testItem._.date.moment('2015-01-01').toDate());
				done();
			});
		});

		it('should clear the value when passed ""', function (done) {
			var testItem = new List.model({
				date: '2015-01-01',
			});
			List.fields.date.updateItem(testItem, {
				date: '',
			}, function () {
				demand(testItem.date).be.null();
				done();
			});
		});

		it('should clear the value when passed null', function (done) {
			var testItem = new List.model({
				date: '2015-01-01',
			});
			List.fields.date.updateItem(testItem, {
				date: null,
			}, function () {
				demand(testItem.date).be.null();
				done();
			});
		});

		it('should not clear the value when a value exists and passed undefined', function (done) {
			var testItem = new List.model({
				date: '2015-01-01',
			});
			List.fields.date.updateItem(testItem, {
				date: undefined,
			}, function () {
				demand(testItem.date).not.be.null();
				done();
			});
		});
	});

	describe('getData', function () {
		it('Retrieval of date set in current timezone', function (done) {
			var testItem = new List.model();
			List.fields.date.updateItem(testItem, {
				date: moment('2015-01-01', 'YYYY-MM-DD'),
			}, function () {
				demand(List.fields.date.getData(testItem)).eql(new Date(2015, 0, 1));
				done();
			});
		});

		it('Retrieval of UTC date', function (done) {
			var testItem = new List.model();
			List.fields.utcDate.updateItem(testItem, {
				utcDate: moment.utc('2015-01-01', 'YYYY-MM-DD'),
			}, function () {
				demand(List.fields.utcDate.getData(testItem)).eql(new Date(Date.UTC(2015, 0, 1)));
				done();
			});
		});

		it('Retrieval of fixable GMT date corrupted with timezone offset', function (done) {
			var testItem = new List.model();
			var timeToCompareInTimezone = moment.utc('2015-01-01', 'YYYY-MM-DD');
			timeToCompareInTimezone.add(-List.fields.utcDateForcedTZ.timezoneUtcOffsetMinutes, 'minutes');
			List.fields.utcDateForcedTZ.updateItem(testItem, {
				utcDateForcedTZ: timeToCompareInTimezone, // Creates time in whatever timezone the test is run in or utcDateForcedTZ is configured to
			}, function () {
				demand(List.fields.utcDateForcedTZ.getData(testItem)).eql(new Date(Date.UTC(2015, 0, 1)));
				done();
			});
		});

		it('Retrieval of non-fixable GMT date corrupted with timezone offset', function (done) {
			var testItem = new List.model();
			var timeToCompareInTimezone = moment.utc('2015-01-01', 'YYYY-MM-DD');
			timeToCompareInTimezone.add(-540, 'minutes');
			List.fields.utcDateForcedTZ.updateItem(testItem, {
				utcDateForcedTZ: timeToCompareInTimezone, // Creates time in whatever timezone the test is run in or utcDateForcedTZ is configured to
			}, function () {
				demand(List.fields.utcDateForcedTZ.getData(testItem)).eql(timeToCompareInTimezone.toDate());
				done();
			});
		});

	});

	describe('validateInput', function () {
		it('should validate date strings', function (done) {
			List.fields.date.validateInput({ date: '2015-01-01' }, function (result) {
				demand(result).be.true();
				done();
			});
		});

		it('should validate JS "Date"s', function (done) {
			List.fields.date.validateInput({ date: new Date(2015, 1, 1) }, function (result) {
				demand(result).be.true();
				done();
			});
		});

		it('should validate epoch times', function (done) {
			List.fields.date.validateInput({ date: 1458269216968 }, function (result) {
				demand(result).be.true();
				done();
			});
		});

		it('should validate empty strings', function (done) {
			List.fields.date.validateInput({ date: '' }, function (result) {
				demand(result).be.true();
				done();
			});
		});

		it('should validate null', function (done) {
			List.fields.date.validateInput({ date: null }, function (result) {
				demand(result).be.true();
				done();
			});
		});

		it('should validate undefined', function (done) {
			List.fields.date.validateInput({ date: undefined }, function (result) {
				demand(result).be.true();
				done();
			});
		});

		it('should invalidate random strings', function (done) {
			List.fields.date.validateInput({ date: 'a' }, function (result) {
				demand(result).be.false();
				done();
			});
		});


		it('should invalidate objects', function (done) {
			List.fields.date.validateInput({ date: { things: 'stuff' } }, function (result) {
				demand(result).be.false();
				done();
			});
		});

		it('should invalidate arrays', function (done) {
			List.fields.date.validateInput({ date: ['a', 'b'] }, function (result) {
				demand(result).be.false();
				done();
			});
		});

		it('should invalidate Booleans', function (done) {
			List.fields.date.validateInput({ date: true }, function (result) {
				demand(result).be.false();
				done();
			});
		});

		it('should invalidate function', function (done) {
			List.fields.date.validateInput({ date: function () {} }, function (result) {
				demand(result).be.false();
				done();
			});
		});

		it('should invalidate regexp', function (done) {
			List.fields.date.validateInput({ date: /foo/ }, function (result) {
				demand(result).be.false();
				done();
			});
		});
	});

	it('should use the common text validateRequiredInput method', function () {
		demand(List.fields.date.validateRequiredInput === TextType.prototype.validateRequiredInput);
	});

	describe('addFilterToQuery', function () {
		it('should filter a specific date', function () {
			var result = List.fields.date.addFilterToQuery({
				value: '2015-01-01',
			});
			demand(result.date).eql({
				$gte: moment('2015-01-01').startOf('day').toDate(),
				$lte: moment('2015-01-01').endOf('day').toDate(),
			});
		});

		it('should filter after a specific date', function () {
			var result = List.fields.date.addFilterToQuery({
				mode: 'after',
				value: '2015-01-01',
			});
			demand(result.date).eql({
				$gt: moment('2015-01-01').endOf('day').toDate(),
			});
		});

		it('should filter before a specific date', function () {
			var result = List.fields.date.addFilterToQuery({
				mode: 'before',
				value: '2015-01-01',
			});
			demand(result.date).eql({
				$lt: moment('2015-01-01').startOf('day').toDate(),
			});
		});

		it('should filter between two specified dates', function () {
			var result = List.fields.date.addFilterToQuery({
				mode: 'between',
				after: '2015-01-01',
				before: '2016-01-01',
			});
			demand(result.date).eql({
				$gte: moment('2015-01-01').startOf('day').toDate(),
				$lte: moment('2016-01-01').endOf('day').toDate(),
			});
		});

		it('should support inverted filtering', function () {
			var result = List.fields.date.addFilterToQuery({
				value: '2015-01-01',
				inverted: true,
			});
			demand(result.date).eql({
				$not: {
					$gte: moment('2015-01-01').startOf('day').toDate(),
					$lte: moment('2015-01-01').endOf('day').toDate(),
				},
			});
		});

		it('should not filter anything in between mode if no value is specified', function () {
			var result = List.fields.date.addFilterToQuery({
				mode: 'between',
			});
			demand(result.date).be.undefined();
		});

		it('should not filter anything in between mode without an after date', function () {
			var result = List.fields.date.addFilterToQuery({
				mode: 'between',
				before: '2015-01-01',
			});
			demand(result.date).be.undefined();
		});

		it('should not filter anything in between mode without a before date', function () {
			var result = List.fields.date.addFilterToQuery({
				mode: 'between',
				after: '2015-01-01',
			});
			demand(result.date).be.undefined();
		});

		it('should not filter anything in between mode with an invalid after date', function () {
			var result = List.fields.date.addFilterToQuery({
				mode: 'between',
				after: 'notadate',
			});
			demand(result.date).be.undefined();
		});

		it('should not filter anything in between mode with an invalid before date', function () {
			var result = List.fields.date.addFilterToQuery({
				mode: 'between',
				before: 'notadate',
			});
			demand(result.date).be.undefined();
		});
	});

	describe('format', function () {
		it('should return an empty string if no date exists', function () {
			var testItem = new List.model();
			demand(testItem._.date.format()).equal('');
		});

		it('should parse date input and return a moment object', function () {
			var m = List.fields.date.parse('2016-02-27');
			demand(m.format('YYYY-MM-DD')).equal('2016-02-27');
		});

		it('should format the date value using moment', function () {
			var testItem = new List.model();
			testItem.date = new Date(2013, 11, 4);
			demand(testItem._.date.format()).equal('4th Dec 2013');
			demand(testItem._.date.format('YYYYMMDD')).equal('20131204');
		});

		it('should return a moment object set to the field value', function () {
			var testItem = new List.model();
			testItem.date = new Date(2013, 11, 4);
			demand(testItem._.date.moment()._isAMomentObject);
			demand(testItem._.date.moment().format('YYYYMMDD')).equal('20131204');
		});
	});
};
