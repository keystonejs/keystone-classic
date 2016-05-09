var demand = require('must');
var NumberArrayType = require('../NumberArrayType');

exports.initList = function (List) {
	List.add({
		numarr: NumberArrayType,
	});
};

exports.getTestItems = function () {
	return [
		{},
		{ numarr: [] },
		{ numarr: [''] },
		{ numarr: ['', ''] },
		{ numarr: [' '] },
		{ numarr: [-1, 0, 1] },
		{ numarr: [0, 1, 2] },
		{ numarr: [1, 2, 3] },
		{ numarr: [2, 3, 4] },
		{ numarr: [3, 4, 5] },
		{ numarr: [10, 12, 14] },
	];
};

exports.testFilters = function (List, filter) {
	describe('no presence specified', function () {
		it('should filter for a number', function (done) {
			filter({
				numarr: {
					value: 2,
				},
			}, 'numarr', function (results) {
				demand(results).eql([
					[0, 1, 2],
					[1, 2, 3],
					[2, 3, 4],
				]);
				done();
			});
		});

		it('should filter for a number string', function (done) {
			filter({
				numarr: {
					value: '2',
				},
			}, 'numarr', function (results) {
				demand(results).eql([
					[0, 1, 2],
					[1, 2, 3],
					[2, 3, 4],
				]);
				done();
			});
		});

		it('should filter for a negative number', function (done) {
			filter({
				numarr: {
					value: -1,
				},
			}, 'numarr', function (results) {
				demand(results).eql([
					[-1, 0, 1],
				]);
				done();
			});
		});

		it('should filter for a boolean number', function (done) {
			filter({
				numarr: {
					value: 0,
				},
			}, 'numarr', function (results) {
				demand(results).eql([
					[-1, 0, 1],
					[0, 1, 2],
				]);
				done();
			});
		});

		it('should filter all arrays with values between two numbers', function (done) {
			filter({
				numarr: {
					mode: 'between',
					value: {
						min: -1,
						max: 2,
					},
				},
			}, 'numarr', function (results) {
				demand(results).eql([
					[-1, 0, 1],
					[0, 1, 2],
					[1, 2, 3],
					[2, 3, 4],
				]);
				done();
			});
		});

		it('should filter all arrays with values greater than a number', function (done) {
			filter({
				numarr: {
					mode: 'gt',
					value: 4,
				},
			}, 'numarr', function (results) {
				demand(results).eql([
					[3, 4, 5],
					[10, 12, 14],
				]);
				done();
			});
		});

		it('should filter all arrays with values less than a number', function (done) {
			filter({
				numarr: {
					mode: 'lt',
					value: 2,
				},
			}, 'numarr', function (results) {
				demand(results).eql([
					[-1, 0, 1],
					[0, 1, 2],
					[1, 2, 3],
				]);
				done();
			});
		});

		it('should filter for all empty arrays', function (done) {
			filter({
				numarr: {},
			}, 'numarr', function (results) {
				demand(results.length).eql(5);
				done();
			});
		});
	});

	describe('"none" present', function () {
		it('should filter all arrays not containing a number', function (done) {
			filter({
				numarr: {
					presence: 'none',
					value: 2,
				},
			}, 'numarr', function (results) {
				demand(results.length).eql(8);
				done();
			});
		});

		it('should filter all arrays with values not between two numbers', function (done) {
			filter({
				numarr: {
					presence: 'none',
					mode: 'between',
					value: {
						min: -1,
						max: 2,
					},
				},
			}, 'numarr', function (results) {
				demand(results.length).eql(7);
				done();
			});
		});

		it('should filter all arrays with values not greater than a number', function (done) {
			filter({
				numarr: {
					presence: 'none',
					mode: 'gt',
					value: 4,
				},
			}, 'numarr', function (results) {
				demand(results.length).eql(9);
				done();
			});
		});

		it('should filter all arrays with values not less than a number', function (done) {
			filter({
				numarr: {
					presence: 'none',
					mode: 'lt',
					value: 2,
				},
			}, 'numarr', function (results) {
				demand(results.length).eql(8);
				done();
			});
		});

		it('should filter for all non-empty arrays', function (done) {
			filter({
				numarr: {
					presence: 'none',
				},
			}, 'numarr', function (results) {
				demand(results.length).eql(6);
				done();
			});
		});
	});

	// Should behave exactly like no presence specified
	describe('"some" present', function () {
		it('should filter for a number', function (done) {
			filter({
				numarr: {
					value: 2,
				},
			}, 'numarr', function (results) {
				demand(results).eql([
					[0, 1, 2],
					[1, 2, 3],
					[2, 3, 4],
				]);
				done();
			});
		});

		it('should filter for a number string', function (done) {
			filter({
				numarr: {
					value: '2',
				},
			}, 'numarr', function (results) {
				demand(results).eql([
					[0, 1, 2],
					[1, 2, 3],
					[2, 3, 4],
				]);
				done();
			});
		});

		it('should filter for a negative number', function (done) {
			filter({
				numarr: {
					value: -1,
				},
			}, 'numarr', function (results) {
				demand(results).eql([
					[-1, 0, 1],
				]);
				done();
			});
		});

		it('should filter for a boolean number', function (done) {
			filter({
				numarr: {
					value: 0,
				},
			}, 'numarr', function (results) {
				demand(results).eql([
					[-1, 0, 1],
					[0, 1, 2],
				]);
				done();
			});
		});

		it('should filter all arrays with values between two numbers', function (done) {
			filter({
				numarr: {
					mode: 'between',
					value: {
						min: -1,
						max: 2,
					},
				},
			}, 'numarr', function (results) {
				demand(results).eql([
					[-1, 0, 1],
					[0, 1, 2],
					[1, 2, 3],
					[2, 3, 4],
				]);
				done();
			});
		});

		it('should filter all arrays with values greater than a number', function (done) {
			filter({
				numarr: {
					mode: 'gt',
					value: 4,
				},
			}, 'numarr', function (results) {
				demand(results).eql([
					[3, 4, 5],
					[10, 12, 14],
				]);
				done();
			});
		});

		it('should filter all arrays with values less than a number', function (done) {
			filter({
				numarr: {
					mode: 'lt',
					value: 2,
				},
			}, 'numarr', function (results) {
				demand(results).eql([
					[-1, 0, 1],
					[0, 1, 2],
					[1, 2, 3],
				]);
				done();
			});
		});

		it('should filter for all empty arrays', function (done) {
			filter({
				numarr: {},
			}, 'numarr', function (results) {
				demand(results.length).eql(5);
				done();
			});
		});
	});
};
