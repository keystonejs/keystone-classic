var demand = require('must');

var keystone = require('../').init(),
	Types = keystone.Field.Types;

/** Test List and Fields */

// use nocreate to allow required fields without tripping `initial` validation
var Test = keystone.List('Test', { nocreate: true }),
	testItem;

before(function() {
	
	// Create a Test List with all the field types that will be tested
	Test.add({
		date: Types.Date,
		datetime: Types.Datetime,
		bool: Types.Boolean,
		location: {
			basic: Types.Location,
			customRequired: { type: Types.Location, required: ['state', 'country'] }
		}
	});
	Test.register();
	
	// Create a new Test Item to run tests against
	testItem = new Test.model();
	
});

/** Tests */

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
		
		it('should be false when passed the string "false"', function() {
			Test.fields.bool.updateItem(testItem, {
				bool: 'false'
			});
			demand(testItem.bool).to.be.false();
		});
		
	});
	
	/** FieldType: Location */
	describe("Location", function() {
		
		var emptyLocationValues = {
			number: '',
			name: '',
			street1: '',
			street2: '',
			suburb: '',
			state: '',
			postcode: '',
			country: '',
			geo: []
		};
		
		var resetLocationValues = function() {
			testItem.set('location.basic', emptyLocationValues);
			testItem.set('location.required', emptyLocationValues);
			testItem.set('location.customRequired', emptyLocationValues);
		}
		
		it('should update its value from flat paths', function() {
			resetLocationValues();
			Test.fields['location.basic'].updateItem(testItem, {
				'location.basic.number': 'number',
				'location.basic.name': 'name',
				'location.basic.street1': 'street 1',
				'location.basic.street2': 'street 2',
				'location.basic.suburb': 'suburb',
				'location.basic.state': 'state',
				'location.basic.postcode': 'postcode',
				'location.basic.country': 'country',
				'location.basic.geo_lat': '-33.865143',
				'location.basic.geo_lng': '151.2099'
			});
			demand(testItem.location.basic.number).to.be('number');
			demand(testItem.location.basic.name).to.be('name');
			demand(testItem.location.basic.street1).to.be('street 1');
			demand(testItem.location.basic.street2).to.be('street 2');
			demand(testItem.location.basic.suburb).to.be('suburb');
			demand(testItem.location.basic.state).to.be('state');
			demand(testItem.location.basic.postcode).to.be('postcode');
			demand(testItem.location.basic.country).to.be('country');
			demand(Array.isArray(testItem.location.basic.geo)).to.be.true();
			demand(testItem.location.basic.geo[0]).to.be(151.2099);
			demand(testItem.location.basic.geo[1]).to.be(-33.865143);
		});
		
		it('should update its value from nested paths', function() {
			resetLocationValues();
			Test.fields['location.basic'].updateItem(testItem, {
				location: {
					basic: {
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
				}
			});
			demand(testItem.location.basic.number).to.be('number');
			demand(testItem.location.basic.name).to.be('name');
			demand(testItem.location.basic.street1).to.be('street 1');
			demand(testItem.location.basic.street2).to.be('street 2');
			demand(testItem.location.basic.suburb).to.be('suburb');
			demand(testItem.location.basic.state).to.be('state');
			demand(testItem.location.basic.postcode).to.be('postcode');
			demand(testItem.location.basic.country).to.be('country');
			demand(Array.isArray(testItem.location.basic.geo)).to.be.true();
			demand(testItem.location.basic.geo[0]).to.be(151.2099);
			demand(testItem.location.basic.geo[1]).to.be(-33.865143);
		});
		
		it('should remove the location.geo path without valid values', function() {
			resetLocationValues();
			Test.fields['location.basic'].updateItem(testItem, {
				'location.basic.geo': ['151.2099', '-33.865143']
			});
			demand(testItem.location.basic.geo[0]).to.be(151.2099);
			demand(testItem.location.basic.geo[1]).to.be(-33.865143);
			Test.fields['location.basic'].updateItem(testItem, {
				'location.basic.geo_lat': '',
				'location.basic.geo_lng': ''
			});
			demand(testItem.location.basic.geo).to.be.undefined();
		});
		
		it('should validate required fields', function() {
			Test.fields['location.basic'].validateInput({}, true, testItem).must.be.false();
			Test.fields['location.basic'].validateInput({
				'location.basic.street1': 'street1',
				'location.basic.suburb': ''
			}, true, testItem).must.be.false();
			Test.fields['location.basic'].validateInput({
				'location.basic.street1': 'street1',
				'location.basic.suburb': 'suburb'
			}, true, testItem).must.be.true();
			Test.fields['location.basic'].validateInput({
				location: { basic: {
					street1: 'street1',
					suburb: 'suburb'
				} }
			}, true, testItem).must.be.true();
			Test.fields['location.customRequired'].validateInput({
				'location.customRequired.street1': 'street1',
				'location.customRequired.suburb': 'suburb'
			}, true, testItem).must.be.false();
			Test.fields['location.customRequired'].validateInput({
				'location.customRequired.state': 'state',
				'location.customRequired.country': 'country'
			}, true, testItem).must.be.true();
		});
		
	});
});
