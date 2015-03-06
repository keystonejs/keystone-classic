var demand = require('must'),
	LocationType = require('../LocationType');

exports.initList = function(List) {
	List.add({
		location: {
			basic: LocationType,
			customRequired: { type: LocationType, required: ['state', 'country'] }
		}
	});
};

exports.testFieldType = function(List) {
	var testItem = new List.model();

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
	};
	
	it('should update its value from flat paths', function() {
		resetLocationValues();
		List.fields['location.basic'].updateItem(testItem, {
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
		List.fields['location.basic'].updateItem(testItem, {
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
		List.fields['location.basic'].updateItem(testItem, {
			'location.basic.geo': ['151.2099', '-33.865143']
		});
		demand(testItem.location.basic.geo[0]).be(151.2099);
		demand(testItem.location.basic.geo[1]).be(-33.865143);
		List.fields['location.basic'].updateItem(testItem, {
			'location.basic.geo_lat': '',
			'location.basic.geo_lng': ''
		});
		demand(testItem.location.basic.geo).be.undefined();
	});
	
	it('should validate required fields', function() {
		List.fields['location.basic'].validateInput({}, true, testItem).must.be.false();
		List.fields['location.basic'].validateInput({
			'location.basic.street1': 'street1',
			'location.basic.suburb': ''
		}, true, testItem).must.be.false();
		List.fields['location.basic'].validateInput({
			'location.basic.street1': 'street1',
			'location.basic.suburb': 'suburb'
		}, true, testItem).must.be.true();
		List.fields['location.basic'].validateInput({
			location: { basic: {
				street1: 'street1',
				suburb: 'suburb'
			} }
		}, true, testItem).must.be.true();
		List.fields['location.customRequired'].validateInput({
			'location.customRequired.street1': 'street1',
			'location.customRequired.suburb': 'suburb'
		}, true, testItem).must.be.false();
		List.fields['location.customRequired'].validateInput({
			'location.customRequired.state': 'state',
			'location.customRequired.country': 'country'
		}, true, testItem).must.be.true();
	});
};
