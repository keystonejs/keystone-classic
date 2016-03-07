var demand = require('must');
var DateType = require('../DateType');

exports.initList = function (List) {
	List.add({
		date: DateType,
	});
};

exports.testFieldType = function (List) {
	var testItem = new List.model();

	it('should parse date input and return a moment object', function () {
		var m = List.fields.date.parse('2016-02-27');
		demand(m.format('YYYY-MM-DD')).equal('2016-02-27');
	});

	it('should format the date value using moment', function () {
		testItem.date = new Date(2013, 11, 4);
		demand(testItem._.date.format()).equal('4th Dec 2013');
		demand(testItem._.date.format('YYYYMMDD')).equal('20131204');
	});

	it('should return a moment object set to the field value', function () {
		testItem.date = new Date(2013, 11, 4);
		demand(testItem._.date.moment()._isAMomentObject);
		demand(testItem._.date.moment().format('YYYYMMDD')).equal('20131204');
	});

	it('should validate input present', function (done) {
		List.fields.date.validateRequiredInput(this, { date: 'a' }, function (result) {
			demand(result).be(true);
			done();
		});
	});

	it('should invalidate input not present', function (done) {
		List.fields.date.validateRequiredInput(this, { date: '' }, function (result) {
			demand(result).be(false);
			done();
		});
	});
};
