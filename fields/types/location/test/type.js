var demand = require('must');
var LocationType = require('../LocationType');

exports.initList = function (List) {
	List.add({
		location: {
			basic: LocationType,
			customRequired: { type: LocationType, required: ['state', 'country'] },
		},
	});
};

exports.testFieldType = function (List) {
	describe('updateItem', function () {
		describe('flat paths', function () {
			it('should update the number', function (done) {
				var testItem = new List.model();
				List.fields['location.basic'].updateItem(testItem, {
					'location.basic.number': 'number',
				}, function () {
					demand(testItem.location.basic.number).be('number');
					done();
				});
			});

			it('should update the name', function (done) {
				var testItem = new List.model();
				List.fields['location.basic'].updateItem(testItem, {
					'location.basic.name': 'name',
				}, function () {
					demand(testItem.location.basic.name).be('name');
					done();
				});
			});

			it('should update the street1', function (done) {
				var testItem = new List.model();
				List.fields['location.basic'].updateItem(testItem, {
					'location.basic.street1': 'street1',
				}, function () {
					demand(testItem.location.basic.street1).be('street1');
					done();
				});
			});

			it('should update the street2', function (done) {
				var testItem = new List.model();
				List.fields['location.basic'].updateItem(testItem, {
					'location.basic.street2': 'street2',
				}, function () {
					demand(testItem.location.basic.street2).be('street2');
					done();
				});
			});

			it('should update the suburb', function (done) {
				var testItem = new List.model();
				List.fields['location.basic'].updateItem(testItem, {
					'location.basic.suburb': 'suburb',
				}, function () {
					demand(testItem.location.basic.suburb).be('suburb');
					done();
				});
			});

			it('should update the state', function (done) {
				var testItem = new List.model();
				List.fields['location.basic'].updateItem(testItem, {
					'location.basic.state': 'state',
				}, function () {
					demand(testItem.location.basic.state).be('state');
					done();
				});
			});

			it('should update the postcode', function (done) {
				var testItem = new List.model();
				List.fields['location.basic'].updateItem(testItem, {
					'location.basic.postcode': 'postcode',
				}, function () {
					demand(testItem.location.basic.postcode).be('postcode');
					done();
				});
			});

			it('should update the country', function (done) {
				var testItem = new List.model();
				List.fields['location.basic'].updateItem(testItem, {
					'location.basic.country': 'country',
				}, function () {
					demand(testItem.location.basic.country).be('country');
					done();
				});
			});

			it('should update the geo', function (done) {
				var testItem = new List.model();
				List.fields['location.basic'].updateItem(testItem, {
					'location.basic.geo': [3.14, 1.59],
				}, function () {
					demand(testItem.location.basic.geo[0]).be(3.14);
					demand(testItem.location.basic.geo[1]).be(1.59);
					done();
				});
			});
		});

		describe('nested paths', function () {
			it('should update the number', function (done) {
				var testItem = new List.model();
				List.fields['location.basic'].updateItem(testItem, {
					location: {
						basic: {
							number: 'number',
						},
					},
				}, function () {
					demand(testItem.location.basic.number).be('number');
					done();
				});
			});

			it('should update the name', function (done) {
				var testItem = new List.model();
				List.fields['location.basic'].updateItem(testItem, {
					location: {
						basic: {
							name: 'name',
						},
					},
				}, function () {
					demand(testItem.location.basic.name).be('name');
					done();
				});
			});

			it('should update the street1', function (done) {
				var testItem = new List.model();
				List.fields['location.basic'].updateItem(testItem, {
					location: {
						basic: {
							street1: 'street1',
						},
					},
				}, function () {
					demand(testItem.location.basic.street1).be('street1');
					done();
				});
			});

			it('should update the street2', function (done) {
				var testItem = new List.model();
				List.fields['location.basic'].updateItem(testItem, {
					location: {
						basic: {
							street2: 'street2',
						},
					},
				}, function () {
					demand(testItem.location.basic.street2).be('street2');
					done();
				});
			});

			it('should update the suburb', function (done) {
				var testItem = new List.model();
				List.fields['location.basic'].updateItem(testItem, {
					location: {
						basic: {
							suburb: 'suburb',
						},
					},
				}, function () {
					demand(testItem.location.basic.suburb).be('suburb');
					done();
				});
			});

			it('should update the state', function (done) {
				var testItem = new List.model();
				List.fields['location.basic'].updateItem(testItem, {
					location: {
						basic: {
							state: 'state',
						},
					},
				}, function () {
					demand(testItem.location.basic.state).be('state');
					done();
				});
			});

			it('should update the postcode', function (done) {
				var testItem = new List.model();
				List.fields['location.basic'].updateItem(testItem, {
					location: {
						basic: {
							postcode: 'postcode',
						},
					},
				}, function () {
					demand(testItem.location.basic.postcode).be('postcode');
					done();
				});
			});

			it('should update the country', function (done) {
				var testItem = new List.model();
				List.fields['location.basic'].updateItem(testItem, {
					location: {
						basic: {
							country: 'country',
						},
					},
				}, function () {
					demand(testItem.location.basic.country).be('country');
					done();
				});
			});

			it('should update the geo', function (done) {
				var testItem = new List.model();
				List.fields['location.basic'].updateItem(testItem, {
					location: {
						basic: {
							geo: [3.14, 1.59],
						},
					},
				}, function () {
					demand(testItem.location.basic.geo[0]).be(3.14);
					demand(testItem.location.basic.geo[1]).be(1.59);
					done();
				});
			});
		});

		it('should remove the location.geo path without valid values', function (done) {
			var testItem = new List.model();
			List.fields['location.basic'].updateItem(testItem, {
				'location.basic.geo': ['151.2099', '-33.865143'],
			}, function () {
				demand(testItem.location.basic.geo[0]).be(151.2099);
				demand(testItem.location.basic.geo[1]).be(-33.865143);

				List.fields['location.basic'].updateItem(testItem, {
					'location.basic.geo_lat': '',
					'location.basic.geo_lng': '',
				}, function () {
					demand(testItem.location.basic.geo).be.undefined();
					done();
				});
			});
		});
	});

	describe('validateInput', function () {

	});

	describe('addFilterToQuery', function () {
		it('should allow to filter by street', function () {
			var result = List.fields['location.basic'].addFilterToQuery({
				street: 'Broadway',
			});
			demand(result['location.basic.street1']).eql(/Broadway/i);
		});

		it('should allow to filter by city', function () {
			var result = List.fields['location.basic'].addFilterToQuery({
				city: 'NYC',
			});
			demand(result['location.basic.suburb']).eql(/NYC/i);
		});

		it('should allow to filter by state', function () {
			var result = List.fields['location.basic'].addFilterToQuery({
				state: 'New York',
			});
			demand(result['location.basic.state']).eql(/New York/i);
		});

		it('should allow to filter by code', function () {
			var result = List.fields['location.basic'].addFilterToQuery({
				code: 10023,
			});
			demand(result['location.basic.postcode']).eql(/10023/i);
		});

		it('should allow to filter by country', function () {
			var result = List.fields['location.basic'].addFilterToQuery({
				country: 'USA',
			});
			demand(result['location.basic.country']).eql(/USA/i);
		});

		it('should support inverted mode', function () {
			var result = List.fields['location.basic'].addFilterToQuery({
				country: 'USA',
				inverted: true,
			});
			demand(result['location.basic.country']).eql({
				$not: /USA/i,
			});
		});
	});


	/* Deprecated inputIsValid method tests */

	it('should validate required fields', function () {
		var testItem = new List.model();
		List.fields['location.basic'].inputIsValid({}, true, testItem).must.be.false();
		List.fields['location.basic'].inputIsValid({
			'location.basic.street1': 'street1',
			'location.basic.suburb': '',
		}, true, testItem).must.be.false();
		List.fields['location.basic'].inputIsValid({
			'location.basic.street1': 'street1',
			'location.basic.suburb': 'suburb',
		}, true, testItem).must.be.true();
		List.fields['location.basic'].inputIsValid({
			location: { basic: {
				street1: 'street1',
				suburb: 'suburb',
			} },
		}, true, testItem).must.be.true();
		List.fields['location.customRequired'].inputIsValid({
			'location.customRequired.street1': 'street1',
			'location.customRequired.suburb': 'suburb',
		}, true, testItem).must.be.false();
		List.fields['location.customRequired'].inputIsValid({
			'location.customRequired.state': 'state',
			'location.customRequired.country': 'country',
		}, true, testItem).must.be.true();
	});
};
