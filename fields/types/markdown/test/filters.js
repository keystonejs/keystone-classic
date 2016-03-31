var demand = require('must');
var MarkdownType = require('../MarkdownType');

exports.initList = function (List) {
	List.add({
		markdown: MarkdownType,
		markdown2: MarkdownType,
	});
};

exports.getTestItems = function () {
	return [
		{},
		{ markdown: '' },
		{ markdown: ' ' },
		{ markdown: 'abc' },
		{ markdown: 'ABCD' },
		{ markdown: 'abcd', markdown2: '123' },
		{ markdown: 'Ab Cd', markdown2: '1 2 3' },
		{ markdown: 'a/b\c@d' },
	];
};

exports.testFilters = function (List, filter) {

	describe('match', function () {

		it('should find exact string matches', function (done) {
			filter({
				markdown: {
					mode: 'exactly',
					value: 'abc',
				},
			}, 'markdown', function (results) {
				var normalized = normalizeResults(results);
				demand(normalized).eql(['abc']);
				done();
			});
		});

		it('should invert exact string matches', function (done) {
			filter({
				markdown: {
					mode: 'exactly',
					inverted: true,
					value: 'abc',
				},
			}, 'markdown', function (results) {
				var normalized = normalizeResults(results);
				demand(normalized).eql([
					undefined,
					'',
					' ',
					'ABCD',
					'abcd',
					'Ab Cd',
					'a/b\c@d',
				]);
				done();
			});
		});

		it('should find empty and null string matches', function (done) {
			filter({
				markdown: {
					mode: 'exactly',
					value: '',
				},
			}, 'markdown', function (results) {
				var normalized = normalizeResults(results);
				demand(normalized).eql([undefined, '']);
				done();
			});
		});

		it('should invert empty and null string matches', function (done) {
			filter({
				markdown: {
					mode: 'exactly',
					inverted: true,
					value: '',
				},
			}, 'markdown', function (results) {
				var normalized = normalizeResults(results);
				demand(normalized).eql([
					' ',
					'abc',
					'ABCD',
					'abcd',
					'Ab Cd',
					'a/b\c@d',
				]);
				done();
			});
		});

		it('should find whitespace matches', function (done) {
			filter({
				markdown: {
					mode: 'exactly',
					value: ' ',
				},
			}, 'markdown', function (results) {
				var normalized = normalizeResults(results);
				demand(normalized).eql([' ']);
				done();
			});
		});

		it('should work with special characters', function (done) {
			filter({
				markdown: {
					mode: 'exactly',
					value: 'a/b\c@d',
				},
			}, 'markdown', function (results) {
				var normalized = normalizeResults(results);
				demand(normalized).eql(['a/b\c@d']);
				done();
			});
		});

		it('should be case insensitive by default', function (done) {
			filter({
				markdown: {
					mode: 'exactly',
					value: 'abcd',
				},
			}, 'markdown', function (results) {
				var normalized = normalizeResults(results);
				demand(normalized).eql(['ABCD', 'abcd']);
				done();
			});
		});

		it('should allow case sensitivity', function (done) {
			filter({
				markdown: {
					caseSensitive: true,
					mode: 'exactly',
					value: 'abcd',
				},
			}, 'markdown', function (results) {
				var normalized = normalizeResults(results);
				demand(normalized).eql(['abcd']);
				done();
			});
		});

		it('should combine correctly', function (done) {
			filter({
				markdown: {
					mode: 'exactly',
					value: 'abcd',
				},
				markdown2: {
					mode: 'exactly',
					value: '123',
				},
			}, 'markdown', function (results) {
				var normalized = normalizeResults(results);
				demand(normalized).eql(['abcd']);
				done();
			});
		});
	});

	describe('beginsWith', function () {

		it('should match the start of strings', function (done) {
			filter({
				markdown: {
					mode: 'beginsWith',
					value: 'abc',
				},
			}, 'markdown', function (results) {
				var normalized = normalizeResults(results);
				demand(normalized).eql([
					'abc',
					'ABCD',
					'abcd',
				]);
				done();
			});
		});

		it('should invert correctly', function (done) {
			filter({
				markdown: {
					mode: 'beginsWith',
					inverted: true,
					value: 'abc',
				},
			}, 'markdown', function (results) {
				var normalized = normalizeResults(results);
				demand(normalized).eql([
					undefined,
					'',
					' ',
					'Ab Cd',
					'a/b\c@d',
				]);
				done();
			});
		});
	});

	describe('endsWith', function () {

		it('should match the end of strings', function (done) {
			filter({
				markdown: {
					mode: 'endsWith',
					value: 'cd',
				},
			}, 'markdown', function (results) {
				var normalized = normalizeResults(results);
				demand(normalized).eql([
					'ABCD',
					'abcd',
					'Ab Cd',
				]);
				done();
			});
		});

		it('should invert correctly', function (done) {
			filter({
				markdown: {
					mode: 'endsWith',
					inverted: true,
					value: 'cd',
				},
			}, 'markdown', function (results) {
				var normalized = normalizeResults(results);
				demand(normalized).eql([
					undefined,
					'',
					' ',
					'abc',
					'a/b\c@d',
				]);
				done();
			});
		});
	});
};

/**
 * Normalizes the results we get from filter()
 *
 * @param  {array} results The results array
 * @return {array}         The normalized results
 */
function normalizeResults (results) {
	var normalized = [];
	for (var i = 0; i < results.length; i++) {
		normalized.push(results[i].md);
	}
	return normalized;
}
