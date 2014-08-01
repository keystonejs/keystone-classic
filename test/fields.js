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
		text: Types.Text,
		bool: Types.Boolean,
		nested: {
			text: String,
			bool: Boolean,
		},
		date: Types.Date,
		datetime: Types.Datetime,
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

describe('Fields', function() {
	
	/** FieldType: Text (String) */
	describe('Text', function() {
		
		it('should update top level fields', function() {
			Test.fields.text.updateItem(testItem, {
				text: 'value'
			});
			demand(testItem.text).be('value');
			testItem.text = undefined;
		});
		
		it('should update nested fields', function() {
			Test.fields['nested.text'].updateItem(testItem, {
				nested: {
					text: 'value'
				}
			});
			demand(testItem.nested.text).be('value');
			testItem.nested.text = undefined;
		});
		
		it('should update nested fields with flat paths', function() {
			Test.fields['nested.text'].updateItem(testItem, {
				'nested.text': 'value'
			});
			demand(testItem.nested.text).be('value');
			testItem.nested.text = undefined;
		});
		
	});
	
	/** FieldType: Boolean */
	describe('Boolean', function() {
		
		it('should be true when passed the boolean true', function() {
			Test.fields.bool.updateItem(testItem, {
				bool: true
			});
			demand(testItem.bool).be.true();
			testItem.bool = undefined;
		});
		
		it('should be true when passed the string "true"', function() {
			Test.fields.bool.updateItem(testItem, {
				bool: 'true'
			});
			demand(testItem.bool).be.true();
			testItem.bool = undefined;
		});
		
		it('should be false when passed the string "false"', function() {
			Test.fields.bool.updateItem(testItem, {
				bool: 'false'
			});
			demand(testItem.bool).be.false();
			testItem.bool = undefined;
		});
		
		it('should update nested fields', function() {
			Test.fields['nested.bool'].updateItem(testItem, {
				nested: {
					bool: true
				}
			});
			demand(testItem.nested.bool).be.true();
			testItem.nested.bool = undefined;
		});
		
		it('should update nested fields with flat paths', function() {
			Test.fields['nested.bool'].updateItem(testItem, {
				'nested.bool': true
			});
			demand(testItem.nested.bool).be.true();
			testItem.nested.bool = undefined;
		});
		
	});
	
	/** FieldType: Date */
	describe('Date', function() {
		
		it('should parse without error via underscore date', function() {
			testItem._.date.parse('20131204', 'YYYYMMDD');
		});
		
		it('should be the date we expect', function() {
			testItem.date = new Date(2013, 11, 4);
			demand(testItem._.date.format()).to.equal('4th Dec 2013');
			demand(testItem._.date.format('YYYYMMDD')).to.equal('20131204');
		});
		
		it('should be a moment object', function() {
			testItem.date = new Date(2013, 11, 4);
			demand(testItem._.date.moment()._isAMomentObject);
		});
		
	});
	
	/** FieldType: Location */
	describe('Location', function() {
		
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
			demand(testItem.location.basic.number).be('number');
			demand(testItem.location.basic.name).be('name');
			demand(testItem.location.basic.street1).be('street 1');
			demand(testItem.location.basic.street2).be('street 2');
			demand(testItem.location.basic.suburb).be('suburb');
			demand(testItem.location.basic.state).be('state');
			demand(testItem.location.basic.postcode).be('postcode');
			demand(testItem.location.basic.country).be('country');
			demand(Array.isArray(testItem.location.basic.geo)).be.true();
			demand(testItem.location.basic.geo[0]).be(151.2099);
			demand(testItem.location.basic.geo[1]).be(-33.865143);
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
			demand(testItem.location.basic.number).be('number');
			demand(testItem.location.basic.name).be('name');
			demand(testItem.location.basic.street1).be('street 1');
			demand(testItem.location.basic.street2).be('street 2');
			demand(testItem.location.basic.suburb).be('suburb');
			demand(testItem.location.basic.state).be('state');
			demand(testItem.location.basic.postcode).be('postcode');
			demand(testItem.location.basic.country).be('country');
			demand(Array.isArray(testItem.location.basic.geo)).be.true();
			demand(testItem.location.basic.geo[0]).be(151.2099);
			demand(testItem.location.basic.geo[1]).be(-33.865143);
		});
		
		it('should remove the location.geo path without valid values', function() {
			resetLocationValues();
			Test.fields['location.basic'].updateItem(testItem, {
				'location.basic.geo': ['151.2099', '-33.865143']
			});
			demand(testItem.location.basic.geo[0]).be(151.2099);
			demand(testItem.location.basic.geo[1]).be(-33.865143);
			Test.fields['location.basic'].updateItem(testItem, {
				'location.basic.geo_lat': '',
				'location.basic.geo_lng': ''
			});
			demand(testItem.location.basic.geo).be.undefined();
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
