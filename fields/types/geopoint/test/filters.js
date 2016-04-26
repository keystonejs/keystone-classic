var demand = require('must');
var GeoPointType = require('../GeoPointType');

exports.initList = function (List) {
	List.add({
		gp: GeoPointType,
	});
};

// Coordinates are in [lon, lat]
const COORDINATES = {
	canberra: [149.14489746, -35.28150066],
	nyc: [-74.0059413, 40.7127837],
	sydneyCenter: [151.2069902, -33.8674869],
	sydneySuburb: [151.00158691, -33.82593446],
	vienna: [16.3738189, 48.2081743],
};

exports.getTestItems = function () {
	return [
		{},
		{ gp: COORDINATES.canberra }, // Canberra
		{ gp: COORDINATES.nyc }, // NYC
		{ gp: COORDINATES.sydneyCenter }, // Sydney center
		{ gp: COORDINATES.sydneySuburb }, // Sydney parramatta
		{ gp: COORDINATES.vienna }, // Vienna
	];
};

exports.testFilters = function (List, filter) {
	it('should find points in a 500km radius max by default (max 500km around sydney center)', function (done) {
		filter({
			gp: {
				lat: COORDINATES.sydneyCenter[1],
				lon: COORDINATES.sydneyCenter[0],
				distance: {},
			},
		}, 'gp', function (results) {
			demand(results).eql([
				COORDINATES.sydneyCenter,
				COORDINATES.sydneySuburb,
				COORDINATES.canberra,
			]);
			done();
		});
	});

	it('should support changing the search radius (20000km around sydney center)', function (done) {
		filter({
			gp: {
				lat: COORDINATES.sydneyCenter[1],
				lon: COORDINATES.sydneyCenter[0],
				distance: {
					value: 20000,
				},
			},
		}, 'gp', function (results) {
			demand(results).eql([
				COORDINATES.sydneyCenter,
				COORDINATES.sydneySuburb,
				COORDINATES.canberra,
				COORDINATES.vienna,
				COORDINATES.nyc,
			]);
			done();
		});
	});

	it('should support minimum distance mode (min 500km around sydney center)', function (done) {
		filter({
			gp: {
				lat: COORDINATES.sydneyCenter[1],
				lon: COORDINATES.sydneyCenter[0],
				distance: {
					mode: 'min',
				},
			},
		}, 'gp', function (results) {
			demand(results).eql([
				COORDINATES.vienna,
				COORDINATES.nyc,
			]);
			done();
		});
	});

	it('should support changing the distance in minimum mode (min 50km around sydney center)', function (done) {
		filter({
			gp: {
				lat: COORDINATES.sydneyCenter[1],
				lon: COORDINATES.sydneyCenter[0],
				distance: {
					mode: 'min',
					value: 50,
				},
			},
		}, 'gp', function (results) {
			demand(results).eql([
				COORDINATES.canberra,
				COORDINATES.vienna,
				COORDINATES.nyc,
			]);
			done();
		});
	});

	it('should not filter anything if lat is not specified', function (done) {
		filter({
			gp: {
				lon: COORDINATES.sydneyCenter[0],
				distance: {},
			},
		}, 'gp', function (results) {
			demand(results).eql([
				undefined,
				COORDINATES.canberra,
				COORDINATES.nyc,
				COORDINATES.sydneyCenter,
				COORDINATES.sydneySuburb,
				COORDINATES.vienna,
			]);
			done();
		});
	});

	it('should not filter anything if lon is not specified', function (done) {
		filter({
			gp: {
				lat: COORDINATES.sydneyCenter[1],
				distance: {},
			},
		}, 'gp', function (results) {
			demand(results).eql([
				undefined,
				COORDINATES.canberra,
				COORDINATES.nyc,
				COORDINATES.sydneyCenter,
				COORDINATES.sydneySuburb,
				COORDINATES.vienna,
			]);
			done();
		});
	});

	it('should not filter anything if neither lat nor lon is not specified', function (done) {
		filter({
			gp: {
				distance: {},
			},
		}, 'gp', function (results) {
			demand(results).eql([
				undefined,
				COORDINATES.canberra,
				COORDINATES.nyc,
				COORDINATES.sydneyCenter,
				COORDINATES.sydneySuburb,
				COORDINATES.vienna,
			]);
			done();
		});
	});
};
