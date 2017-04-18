var demand = require('must');
var MoneyType = require('../MoneyType');

exports.initList = function (List) {
	List.add({
		cash1: MoneyType,
	});
};

exports.getTestItems = function () {
	return [
		{},
		{ cash1: -1 },
		{ cash1: 0 },
		{ cash1: 1 },
		{ cash1: 2 },
		{ cash1: 3 },
	];
};

exports.testFilters = function (List, filter) {

	describe('equals', function () {

		it('should find exact matches', function (done) {
			filter({
				cash1: {
					mode: 'equals',
					value: 2,
				},
			}, 'cash1', function (results) {
				demand(results).eql([2]);
				done();
			});
		});

		it('should invert exact matches', function (done) {
			filter({
				cash1: {
					mode: 'equals',
					inverted: true,
					value: 2,
				},
			}, 'cash1', function (results) {
				demand(results).eql([
					undefined,
					-1,
					0,
					1,
					3,
				]);
				done();
			});
		});

		it('should find empty and null string matches', function (done) {
			filter({
				cash1: {
					mode: 'equals',
					value: '',
				},
			}, 'cash1', function (results) {
				demand(results).eql([undefined]);
				done();
			});
		});

		it('should invert empty and null string matches', function (done) {
			filter({
				cash1: {
					mode: 'equals',
					inverted: true,
					value: '',
				},
			}, 'cash1', function (results) {
				demand(results).eql([
					-1,
					0,
					1,
					2,
					3,
				]);
				done();
			});
		});
	});

	describe('between', function () {

		it('should match items inside the range', function (done) {
			filter({
				cash1: {
					mode: 'between',
					value: {
						max: 2,
						min: 0,
					},
				},
			}, 'cash1', function (results) {
				demand(results).eql([
					0,
					1,
					2,
				]);
				done();
			});
		});

		it('inverted should match items outside the range', function (done) {
			filter({
				cash1: {
					mode: 'between',
					inverted: true,
					value: {
						max: 2,
						min: 0,
					},
				},
			}, 'cash1', function (results) {
				demand(results).eql([
					-1,
					3,
				]);
				done();
			});
		});
	});

	describe('gt', function () {

		it('should match items greater than the value', function (done) {
			filter({
				cash1: {
					mode: 'gt',
					value: 1,
				},
			}, 'cash1', function (results) {
				demand(results).eql([
					2,
					3,
				]);
				done();
			});
		});

		it('inverted should match items less than the value', function (done) {
			filter({
				cash1: {
					mode: 'gt',
					inverted: true,
					value: 1,
				},
			}, 'cash1', function (results) {
				demand(results).eql([
					-1,
					0,
				]);
				done();
			});
		});
	});

	describe('lt', function () {

		it('should match items greater than the value', function (done) {
			filter({
				cash1: {
					mode: 'lt',
					value: 1,
				},
			}, 'cash1', function (results) {
				demand(results).eql([
					-1,
					0,
				]);
				done();
			});
		});

		it('inverted should match items less than the value', function (done) {
			filter({
				cash1: {
					mode: 'lt',
					inverted: true,
					value: 1,
				},
			}, 'cash1', function (results) {
				demand(results).eql([
					2,
					3,
				]);
				done();
			});
		});
	});
};
