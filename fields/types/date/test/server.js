var demand = require('must');
var DateType = require('../DateType');
var TextType = require('../../text/TextType');

exports.initList = function (List) {
	List.add({
		date: DateType,
	});
};

exports.testFieldType = function (List) {
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

	it('should use the common text input validator', function () {
		demand(List.fields.date.validateRequiredInput === TextType.prototype.validateRequiredInput);
	});

	describe('validateInput', function () {
		it('should validate date strings', function (done) {
			List.fields.date.validateInput({ date: '2015-01-01' }, function (result) {
				demand(result).be(true);
				done();
			});
		});

		// TODO This shouldn't fail
		it('should validate dates', function (done) {
			List.fields.date.validateInput({ date: new Date() }, function (result) {
				demand(result).be(true);
				done();
			});
		});

		it('should validate empty strings', function (done) {
			List.fields.date.validateInput({ date: '' }, function (result) {
				demand(result).be(true);
				done();
			});
		});

		it('should validate null', function (done) {
			List.fields.date.validateInput({ date: null }, function (result) {
				demand(result).be(true);
				done();
			});
		});

		it('should validate undefined', function (done) {
			List.fields.date.validateInput({ date: undefined }, function (result) {
				demand(result).be(true);
				done();
			});
		});

		it('should invalidate random strings', function (done) {
			List.fields.date.validateInput({ date: 'a' }, function (result) {
				demand(result).be(false);
				done();
			});
		});


		it('should invalidate objects', function (done) {
			List.fields.date.validateInput({ date: { things: 'stuff' } }, function (result) {
				demand(result).be(false);
				done();
			});
		});

		it('should invalidate arrays', function (done) {
			List.fields.date.validateInput({ date: ['a', 'b'] }, function (result) {
				demand(result).be(false);
				done();
			});
		});

		it('should invalidate Booleans', function (done) {
			List.fields.date.validateInput({ date: true }, function (result) {
				demand(result).be(false);
				done();
			});
		});

		it('should invalidate function', function (done) {
			List.fields.date.validateInput({ date: function () {} }, function (result) {
				demand(result).be(false);
				done();
			});
		});

		it('should invalidate regexp', function (done) {
			List.fields.date.validateInput({ date: /foo/ }, function (result) {
				demand(result).be(false);
				done();
			});
		});
	});
};
