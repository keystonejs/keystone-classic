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
		bool: Types.Boolean,
		location: Types.Location
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
		
		it('should be true when passed the boolean true', function() {
			Test.fields.bool.updateItem(testItem, {
				bool: true
			});
			demand(testItem.bool).to.be.true();
		});
		
		it('should be true when passed the string "true"', function() {
			Test.fields.bool.updateItem(testItem, {
				bool: 'true'
			});
			demand(testItem.bool).to.be.true();
		});
		
	});
	
	/** FieldType: Boolean */
	describe("Location", function() {
		
		it('should update its value from flat paths', function() {
			Test.fields.location.updateItem(testItem, {
				'location.number': 'number',
				'location.name': 'name',
				'location.street1': 'street 1',
				'location.street2': 'street 2',
				'location.suburb': 'suburb',
				'location.state': 'state',
				'location.postcode': 'postcode',
				'location.country': 'country',
				'location.geo_lat': '-33.865143',
				'location.geo_lng': '151.2099'
			});
			demand(testItem.location.number).to.be('number');
			demand(testItem.location.name).to.be('name');
			demand(testItem.location.street1).to.be('street 1');
			demand(testItem.location.street2).to.be('street 2');
			demand(testItem.location.suburb).to.be('suburb');
			demand(testItem.location.state).to.be('state');
			demand(testItem.location.postcode).to.be('postcode');
			demand(testItem.location.country).to.be('country');
			demand(Array.isArray(testItem.location.geo)).to.be.true();
			demand(testItem.location.geo[0]).to.be(151.2099);
			demand(testItem.location.geo[1]).to.be(-33.865143);
		});
		
		it('should update its value from nested paths', function() {
			Test.fields.location.updateItem(testItem, {
				location: {
					number: 'number',
					name: 'name',
					street1: 'street 1',
					street2: 'street 2',
					suburb: 'suburb',
					state: 'state',
					postcode: 'postcode',
					country: 'country',
					geo: ['151.2099', '-33.865143']
				}
			});
			demand(testItem.location.number).to.be('number');
			demand(testItem.location.name).to.be('name');
			demand(testItem.location.street1).to.be('street 1');
			demand(testItem.location.street2).to.be('street 2');
			demand(testItem.location.suburb).to.be('suburb');
			demand(testItem.location.state).to.be('state');
			demand(testItem.location.postcode).to.be('postcode');
			demand(testItem.location.country).to.be('country');
			demand(Array.isArray(testItem.location.geo)).to.be.true();
			demand(testItem.location.geo[0]).to.be(151.2099);
			demand(testItem.location.geo[1]).to.be(-33.865143);
		});
		
	});
});
