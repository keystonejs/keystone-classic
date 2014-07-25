var demand = require('must');

var keystone = require('../').init(),
	Types = keystone.Field.Types;

/** Test List and Fields */

var Test = keystone.List('Test'),
	testItem;

before(function() {
	
	// Create a Test List with all the field types that will be tested
	
	Test.add({
		date: Types.Date,
		datetime: Types.Datetime,
		bool: Types.Boolean
	});
	
	Test.register();
	
	// Create a new Test Item to run tests against
	
	testItem = new Test.model();
	
});

describe("Fields", function() {
	
	/** FieldType: Date */
	describe("Date", function() {
		
		it('should parse without error via underscore date', function() {
			testItem._.date.parse('20131204', 'YYYYMMDD');
		});
		
		it('should be the date we expect', function() {
			demand(testItem._.date.format()).to.equal('4th Dec 2013');
			demand(testItem._.date.format('YYYYMMDD')).to.equal('20131204');
		});
		
		it('should be a moment object', function() {
			demand(testItem._.date.moment()._isAMomentObject);
		});
		
	});
	
	/** FieldType: Boolean */
	describe("Boolean", function() {
		
		it('should update it\'s model if data passed is boolean true', function() {
			Test.fields.bool.updateItem(testItem, {
				'bool': true
			});
			demand(testItem.bool).to.be.true();
		});
		
	   	it('should update it\'s  model if data passed is string \'true\'', function() {
			Test.fields.bool.updateItem(testItem, {
				'bool': 'true'
			});
			demand(testItem.bool).to.be.true();
		});
	   	
	});
});
