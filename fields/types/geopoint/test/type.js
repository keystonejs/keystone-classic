var demand = require('must');
var GeoPointType = require('../GeoPointType');

exports.initList = function (List) {
	List.add({
		geo: { type: GeoPointType },
		nested: {
			geo: { type: GeoPointType },
		},
	});
};

exports.testFieldType = function (List) {
	describe('updateItem', function () {
		it('should update top level fields', function (done) {
			var testItem = new List.model();
			List.fields.geo.updateItem(testItem, {
				geo: [1, 2],
			}, function () {
				demand(testItem.geo).eql([1, 2]);
				testItem.geo = undefined;
				done();
			});
		});

		it('should update nested fields', function (done) {
			var testItem = new List.model();
			List.fields['nested.geo'].updateItem(testItem, {
				nested: {
					geo: [1, 2],
				},
			}, function () {
				demand(testItem.nested.geo).eql([1, 2]);
				testItem.nested.geo = undefined;
				done();
			});
		});

		it('should update nested fields with flat paths', function (done) {
			var testItem = new List.model();
			List.fields['nested.geo'].updateItem(testItem, {
				'nested.geo': [1, 2],
			}, function () {
				demand(testItem.nested.geo).eql([1, 2]);
				testItem.nested.geo = undefined;
				done();
			});
		});
	});

	describe('validateInput', function () {
		it('should validate numeric array input with two items', function (done) {
			List.fields.geo.validateInput({
				geo: [1, 2],
			}, function (result) {
				demand(result).be.true();
				done();
			});
		});

		it('should validate correctly formatted string input', function (done) {
			List.fields.geo.validateInput({
				geo: '3.1, 4.5',
			}, function (result) {
				demand(result).be.true();
				done();
			});
		});

		it('should validate empty string input', function (done) {
			List.fields.geo.validateInput({
				geo: '',
			}, function (result) {
				demand(result).be.true();
				done();
			});
		});

		it('should validate undefined input', function (done) {
			List.fields.geo.validateInput({}, function (result) {
				demand(result).be.true();
				done();
			});
		});

		it('should validate null input', function (done) {
			List.fields.geo.validateInput({
				geo: null,
			}, function (result) {
				demand(result).be.true();
				done();
			});
		});

		it('should invalidate numeric array input with more than two items', function (done) {
			List.fields.geo.validateInput({
				geo: [1, 2, 3],
			}, function (result) {
				demand(result).be.false();
				done();
			});
		});

		it('should invalidate numeric array input with less than two items', function (done) {
			List.fields.geo.validateInput({
				geo: [1],
			}, function (result) {
				demand(result).be.false();
				done();
			});
		});

		it('should invalidate random string input', function (done) {
			List.fields.geo.validateInput({
				geo: 'asdf',
			}, function (result) {
				demand(result).be.false();
				done();
			});
		});

		it('should invalidate object input', function (done) {
			List.fields.geo.validateInput({
				geo: { things: 'stuff' },
			}, function (result) {
				demand(result).be.false();
				done();
			});
		});

		it('should invalidate array input', function (done) {
			List.fields.geo.validateInput({
				geo: [1, 2, 3],
			}, function (result) {
				demand(result).be.false();
				done();
			});
		});

		it('should invalidate Boolean input', function (done) {
			List.fields.geo.validateInput({
				geo: true,
			}, function (result) {
				demand(result).be.false();
				done();
			});
		});

		it('should invalidate function input', function (done) {
			List.fields.geo.validateInput({
				geo: function () {},
			}, function (result) {
				demand(result).be.false();
				done();
			});
		});

		it('should invalidate regexp input', function (done) {
			List.fields.geo.validateInput({
				geo: /foo/,
			}, function (result) {
				demand(result).be.false();
				done();
			});
		});

		it('should invalidate date input', function (done) {
			List.fields.geo.validateInput({
				geo: new Date(),
			}, function (result) {
				demand(result).be.false();
				done();
			});
		});
	});

	describe('validateRequiredInput', function () {
		it('should validate an array with two items as input', function (done) {
			var testItem = new List.model();
			List.fields.geo.validateRequiredInput(testItem, {
				geo: [2, 3],
			}, function (result) {
				demand(result).be.true();
				done();
			});
		});

		it('should validate a well-formatted string as input', function (done) {
			var testItem = new List.model();
			List.fields.geo.validateRequiredInput(testItem, {
				geo: '3.14, 1.59',
			}, function (result) {
				demand(result).be.true();
				done();
			});
		});

		it('should invalidate undefined', function (done) {
			var testItem = new List.model();
			List.fields.geo.validateRequiredInput(testItem, {
				geo: undefined,
			}, function (result) {
				demand(result).be.false();
				done();
			});
		});

		it('should validate undefined if a previous value exists', function (done) {
			var testItem = new List.model({
				geo: [3.14, 1.5],
			});
			List.fields.geo.validateRequiredInput(testItem, {
				geo: undefined,
			}, function (result) {
				demand(result).be.true();
				done();
			});
		});

		it('should invalidate empty string', function (done) {
			var testItem = new List.model();
			List.fields.geo.validateRequiredInput(testItem, {
				geo: '',
			}, function (result) {
				demand(result).be.false();
				done();
			});
		});

		it('should invalidate null', function (done) {
			var testItem = new List.model();
			List.fields.geo.validateRequiredInput(testItem, {
				geo: null,
			}, function (result) {
				demand(result).be.false();
				done();
			});
		});
	});

	describe('addFilterToQuery', function () {
		it('should filter for a latitude and a longitude with a maximum distance', function () {
			var result = List.fields.geo.addFilterToQuery({
				lat: 33,
				lon: 151,
				distance: {
					mode: 'max',
					value: 100,
				},
			});

			demand(result.geo).eql({
				$near: {
					$geometry: {
						type: 'Point',
						coordinates: [151, 33],
					},
					$maxDistance: 100000,
				},
			});
		});

		it('should filter for a latitude and a longitude with a minimum distance', function () {
			var result = List.fields.geo.addFilterToQuery({
				lat: 31,
				lon: 151,
				distance: {
					mode: 'min',
					value: 100,
				},
			});

			demand(result.geo).eql({
				$near: {
					$geometry: {
						type: 'Point',
						coordinates: [151, 31],
					},
					$minDistance: 100000,
				},
			});
		});

		it('should default to max distance', function () {
			var result = List.fields.geo.addFilterToQuery({
				lat: 31,
				lon: 151,
				distance: {
					mode: undefined,
					value: 100,
				},
			});

			demand(result.geo).eql({
				$near: {
					$geometry: {
						type: 'Point',
						coordinates: [151, 31],
					},
					$maxDistance: 100000,
				},
			});
		});

		it('should default to a 500km radius', function () {
			var result = List.fields.geo.addFilterToQuery({
				lat: 31,
				lon: 151,
				distance: {
					mode: 'max',
					value: undefined,
				},
			});

			demand(result.geo).eql({
				$near: {
					$geometry: {
						type: 'Point',
						coordinates: [151, 31],
					},
					$maxDistance: 500000,
				},
			});
		});

		it('should not filter anything if the latitude is undefined', function () {
			var result = List.fields.geo.addFilterToQuery({
				lat: undefined,
				lon: 151,
			});

			demand(result.geo).be.undefined();
		});

		it('should not filter anything if the longitude is undefined', function () {
			var result = List.fields.geo.addFilterToQuery({
				lat: 31,
				lon: undefined,
			});

			demand(result.geo).be.undefined();
		});
	});
};
