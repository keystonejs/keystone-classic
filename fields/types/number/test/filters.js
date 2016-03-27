var demand = require('must');

exports.initList = function (List) {
	List.add({
		num1: Number,
	});
};

exports.getTestItems = function () {
	return [
		{},
		{ num1: -1 },
		{ num1: 0 },
		{ num1: 1 },
		{ num1: 2 },
		{ num1: 3 },
	];
};

exports.testFilters = function (List, filter) {

	describe('equals', function () {

		it('should find exact matches', function (done) {
			filter({
				num1: {
					mode: 'equals',
					value: 2,
				},
			}, 'num1', function (results) {
				demand(results).eql([2]);
				done();
			});
		});

		it('should invert exact matches', function (done) {
			filter({
				num1: {
					mode: 'equals',
					inverted: true,
					value: 2,
				},
			}, 'num1', function (results) {
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
				num1: {
					mode: 'equals',
					value: '',
				},
			}, 'num1', function (results) {
				demand(results).eql([undefined]);
				done();
			});
		});

		it('should invert empty and null string matches', function (done) {
			filter({
				num1: {
					mode: 'equals',
					inverted: true,
					value: '',
				},
			}, 'num1', function (results) {
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
				num1: {
					mode: 'between',
					value: {
						max: 2,
						min: 0,
					},
				},
			}, 'num1', function (results) {
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
				num1: {
					mode: 'between',
					inverted: true,
					value: {
						max: 2,
						min: 0,
					},
				},
			}, 'num1', function (results) {
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
				num1: {
					mode: 'gt',
					value: 1,
				},
			}, 'num1', function (results) {
				demand(results).eql([
					2,
					3,
				]);
				done();
			});
		});

		it('inverted should match items less than the value', function (done) {
			filter({
				num1: {
					mode: 'gt',
					inverted: true,
					value: 1,
				},
			}, 'num1', function (results) {
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
				num1: {
					mode: 'lt',
					value: 1,
				},
			}, 'num1', function (results) {
				demand(results).eql([
					-1,
					0,
				]);
				done();
			});
		});

		it('inverted should match items less than the value', function (done) {
			filter({
				num1: {
					mode: 'lt',
					inverted: true,
					value: 1,
				},
			}, 'num1', function (results) {
				demand(results).eql([
					2,
					3,
				]);
				done();
			});
		});
	});
};
