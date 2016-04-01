var demand = require('must');
var TextArrayType = require('../TextArrayType');

exports.initList = function (List) {
	List.add({
		textarr: TextArrayType,
	});
};

exports.getTestItems = function () {
	return [
		{},
		{ textarr: [] },
		{ textarr: [''] },
		{ textarr: ['', ''] },
		{ textarr: [' '] },
		{ textarr: ['a', 'b', 'c'] },
		{ textarr: ['A', 'B', 'C'] },
		{ textarr: ['abc', 'def'] },
		{ textarr: ['ace', 'gik'] },
		{ textarr: [1, 2, 3] },
	];
};

exports.testFilters = function (List, filter) {
	describe('no presence specified', function () {
		it('should filter a string', function (done) {
			filter({
				textarr: {
					value: 'a',
				},
			}, 'textarr', function (results) {
				demand(results).eql([
					['a', 'b', 'c'],
					['A', 'B', 'C'],
					['abc', 'def'],
					['ace', 'gik'],
				]);
				done();
			});
		});

		it('should filter case sensitively', function (done) {
			filter({
				textarr: {
					value: 'a',
					caseSensitive: true,
				},
			}, 'textarr', function (results) {
				demand(results).eql([
					['a', 'b', 'c'],
					['abc', 'def'],
					['ace', 'gik'],
				]);
				done();
			});
		});

		it('should filter a number', function (done) {
			filter({
				textarr: {
					value: 1,
				},
			}, 'textarr', function (results) {
				demand(results).eql([
					['1', '2', '3'],
				]);
				done();
			});
		});

		it('should filter a string exactly', function (done) {
			filter({
				textarr: {
					value: 'a',
					mode: 'exactly',
				},
			}, 'textarr', function (results) {
				demand(results).eql([
					['a', 'b', 'c'],
					['A', 'B', 'C'],
				]);
				done();
			});
		});

		it('should filter for strings beginning with something', function (done) {
			filter({
				textarr: {
					value: 'ab',
					mode: 'beginsWith',
				},
			}, 'textarr', function (results) {
				demand(results).eql([
					['abc', 'def'],
				]);
				done();
			});
		});

		it('should filter for strings ending with something', function (done) {
			filter({
				textarr: {
					value: 'bc',
					mode: 'endsWith',
				},
			}, 'textarr', function (results) {
				demand(results).eql([
					['abc', 'def'],
				]);
				done();
			});
		});

		it('should filter arrays with empty values', function (done) {
			filter({
				textarr: {},
			}, 'textarr', function (results) {
				demand(results.length).be(4);
				done();
			});
		});
	});

	describe('"none" present', function () {
		it('should not filter empty fields out', function (done) {
			filter({
				textarr: {
					presence: 'none',
					value: 'a',
				},
			}, 'textarr', function (results) {
				demand(results.length).be(6);
				done();
			});
		});

		it('should filter for non-empty fields', function (done) {
			filter({
				textarr: {
					presence: 'none',
				},
			}, 'textarr', function (results) {
				demand(results.length).be(6);
				done();
			});
		});

		// The rest of the function is already tested with the other presences
	});

	// Should behave exactly like no presence specified
	describe('"some" present', function () {
		it('should filter a string', function (done) {
			filter({
				textarr: {
					presence: 'some',
					value: 'a',
				},
			}, 'textarr', function (results) {
				demand(results).eql([
					['a', 'b', 'c'],
					['A', 'B', 'C'],
					['abc', 'def'],
					['ace', 'gik'],
				]);
				done();
			});
		});

		it('should filter case sensitively', function (done) {
			filter({
				textarr: {
					presence: 'some',
					value: 'a',
					caseSensitive: true,
				},
			}, 'textarr', function (results) {
				demand(results).eql([
					['a', 'b', 'c'],
					['abc', 'def'],
					['ace', 'gik'],
				]);
				done();
			});
		});

		it('should filter a number', function (done) {
			filter({
				textarr: {
					presence: 'some',
					value: 1,
				},
			}, 'textarr', function (results) {
				demand(results).eql([
					['1', '2', '3'],
				]);
				done();
			});
		});

		it('should filter a string exactly', function (done) {
			filter({
				textarr: {
					presence: 'some',
					value: 'a',
					mode: 'exactly',
				},
			}, 'textarr', function (results) {
				demand(results).eql([
					['a', 'b', 'c'],
					['A', 'B', 'C'],
				]);
				done();
			});
		});

		it('should filter for strings beginning with something', function (done) {
			filter({
				textarr: {
					presence: 'some',
					value: 'ab',
					mode: 'beginsWith',
				},
			}, 'textarr', function (results) {
				demand(results).eql([
					['abc', 'def'],
				]);
				done();
			});
		});

		it('should filter for strings ending with something', function (done) {
			filter({
				textarr: {
					presence: 'some',
					value: 'bc',
					mode: 'endsWith',
				},
			}, 'textarr', function (results) {
				demand(results).eql([
					['abc', 'def'],
				]);
				done();
			});
		});

		it('should filter arrays with empty values', function (done) {
			filter({
				textarr: {
					presence: 'some',
				},
			}, 'textarr', function (results) {
				demand(results.length).be(4);
				done();
			});
		});
	});
};
