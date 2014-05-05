var demand = require('must');

var keystone = require('../').init(),
	Types = keystone.Field.Types;

/** Test List and Fields */

var Test = keystone.List('Test');

Test.add({
	date: Types.Date,
	datetime: Types.Datetime
});

Test.register();

/** Test Item */

var item = new Test.model();

/** FieldType: Date */

describe("Fields", function() {
	describe("Date", function() {

		it('should parse without error via underscore date', function() {
			item._.date.parse('20131204', 'YYYYMMDD');
		});

		it('should be the date we expect', function() {
			demand(item._.date.format()).to.equal('4th Dec 2013');
			demand(item._.date.format('YYYYMMDD')).to.equal('20131204');
		});

		it('should be a moment object', function() {
			demand(item._.date.moment()._isAMomentObject);
		});

	});
});
