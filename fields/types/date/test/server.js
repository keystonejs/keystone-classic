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
		demand(m.format('YYYY-MM-DD')).to.equal('2016-02-27');
	});

	it('should be the date we expect', function () {
		testItem.date = new Date(2013, 11, 4);
		demand(testItem._.date.format()).to.equal('4th Dec 2013');
		demand(testItem._.date.format('YYYYMMDD')).to.equal('20131204');
	});

	it('should be a moment object', function () {
		testItem.date = new Date(2013, 11, 4);
		demand(testItem._.date.moment()._isAMomentObject);
	});
};
