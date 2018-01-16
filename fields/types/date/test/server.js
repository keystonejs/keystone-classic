var demand = require('must'),
	DateType = require('../DateType');

exports.initList = function(List) {
	List.add({
		date: DateType
	});
};

exports.testFieldType = function(List) {
	var testItem = new List.model();

	it('should parse without error via underscore date', function() {
		testItem._.date.parse('20131204', 'YYYYMMDD');
	});

	it('should be the date we expect', function() {
		testItem.date = new Date(2013, 11, 4);
		demand(testItem._.date.format()).to.equal('2013-12-04');
		demand(testItem._.date.format('YYYYMMDD')).to.equal('20131204');
	});

	it('should be a moment object', function() {
		testItem.date = new Date(2013, 11, 4);
		demand(testItem._.date.moment()._isAMomentObject);
	});
};
