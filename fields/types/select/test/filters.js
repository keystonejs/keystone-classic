var demand = require('must');
var SelectType = require('../SelectType');

exports.initList = function (List) {
	List.add({
		textSelect: { type: SelectType, options: 'one, two, three' },
		numericSelect: { type: SelectType, numeric: true, options: [
			{ value: 0, label: 'Zero' },
			{ value: 1, label: 'One' },
			{ value: 2, label: 'Two' },
		] },
	});
};

exports.getTestItems = function () {
	return [
		{},
		{ textSelect: '', numericSelect: 0 },
		{ textSelect: 'one', numericSelect: 1 },
		{ textSelect: 'two', numericSelect: 2 },
		{ textSelect: 'three' },
	];
};

exports.testFilters = function (List, filter) {

	describe('text values', function () {

		it('should find exact text matches', function (done) {
			filter({
				textSelect: {
					value: 'one',
				},
			}, 'textSelect', function (results) {
				demand(results).eql(['one']);
				done();
			});
		});

		it('should invert exact text matches', function (done) {
			filter({
				textSelect: {
					inverted: true,
					value: 'one',
				},
			}, 'textSelect', function (results) {
				demand(results).eql([undefined, undefined, 'two', 'three']);
				done();
			});
		});

		it('should find multiple text matches', function (done) {
			filter({
				textSelect: {
					value: ['one', 'two'],
				},
			}, 'textSelect', function (results) {
				demand(results).eql(['one', 'two']);
				done();
			});
		});

		it('should invert multiple text matches', function (done) {
			filter({
				textSelect: {
					inverted: true,
					value: ['one', 'two'],
				},
			}, 'textSelect', function (results) {
				demand(results).eql([undefined, undefined, 'three']);
				done();
			});
		});

		it('should find empty text matches', function (done) {
			filter({
				textSelect: {
					value: '',
				},
			}, 'textSelect', function (results) {
				demand(results).eql([undefined, undefined]);
				done();
			});
		});

		it('should invert empty text matches', function (done) {
			filter({
				textSelect: {
					inverted: true,
					value: '',
				},
			}, 'textSelect', function (results) {
				demand(results).eql(['one', 'two', 'three']);
				done();
			});
		});

	});

	describe('numeric values', function () {

		it('should find exact numeric matches', function (done) {
			filter({
				numericSelect: {
					value: 1,
				},
			}, 'numericSelect', function (results) {
				demand(results).eql([1]);
				done();
			});
		});

		it('should invert exact numeric matches', function (done) {
			filter({
				numericSelect: {
					inverted: true,
					value: 1,
				},
			}, 'numericSelect', function (results) {
				demand(results).eql([undefined, 0, 2, undefined]);
				done();
			});
		});

		it('should find multiple numeric matches', function (done) {
			filter({
				numericSelect: {
					value: [1, 2],
				},
			}, 'numericSelect', function (results) {
				demand(results).eql([1, 2]);
				done();
			});
		});

		it('should invert multiple numeric matches', function (done) {
			filter({
				numericSelect: {
					inverted: true,
					value: [1, 2],
				},
			}, 'numericSelect', function (results) {
				demand(results).eql([undefined, 0, undefined]);
				done();
			});
		});

		it('should find empty numeric matches', function (done) {
			filter({
				numericSelect: {
					value: '',
				},
			}, 'numericSelect', function (results) {
				demand(results).eql([undefined, undefined]);
				done();
			});
		});

		it('should invert empty numeric matches', function (done) {
			filter({
				numericSelect: {
					inverted: true,
					value: '',
				},
			}, 'numericSelect', function (results) {
				demand(results).eql([0, 1, 2]);
				done();
			});
		});

	});

	describe('combined values', function () {

		it('should find combined text and numeric matches', function (done) {
			filter({
				textSelect: {
					value: 'one',
				},
				numericSelect: {
					value: 1,
				},
			}, 'textSelect', function (results) {
				demand(results).eql(['one']);
				done();
			});
		});

		it('should combine with inverted matches', function (done) {
			filter({
				textSelect: {
					value: 'one',
				},
				numericSelect: {
					inverted: true,
					value: 2,
				},
			}, 'textSelect', function (results) {
				demand(results).eql(['one']);
				done();
			});
		});

		it('should combine with inverted negating matches', function (done) {
			filter({
				textSelect: {
					value: 'one',
				},
				numericSelect: {
					inverted: true,
					value: 1,
				},
			}, 'textSelect', function (results) {
				demand(results).eql([]);
				done();
			});
		});

	});
};
