var _ = require('lodash');
var demand = require('must');

exports.initList = function (List) {
	List.add({
		text1: String,
		text2: String,
	});
};

exports.getTestItems = function () {
	return [
		{},
		{ text1: '' },
		{ text1: ' ' },
		{ text1: 'abc' },
		{ text1: 'ABCD' },
		{ text1: 'abcd', text2: '123' },
		{ text1: 'Ab Cd', text2: '1 2 3' },
		{ text1: 'a/b\c@d' },
	];
};

exports.testFilters = function (List) {
	function filter (filters, callback) {
		var where = List.addFiltersToQuery(filters);
		List.model.find(where, callback);
	}

	describe('match', function () {

		it('should find exact string matches', function (done) {
			filter({ text1: {
				mode: 'exactly',
				value: 'abc',
			} }, function (err, results) {
				demand(results.length).be(1);
				demand(results[0].text1).be('abc');
				done();
			});
		});

		it('should invert exact string matches', function (done) {
			filter({ text1: {
				mode: 'exactly',
				inverted: true,
				value: 'abc',
			} }, function (err, results) {
				demand(_.map(results, 'text1')).eql([
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
			filter({ text1: {
				mode: 'exactly',
				value: '',
			} }, function (err, results) {
				demand(results.length).be(2);
				demand(results[0].text1).be(undefined);
				demand(results[1].text1).be('');
				done();
			});
		});

		it('should invert empty and null string matches', function (done) {
			filter({ text1: {
				mode: 'exactly',
				inverted: true,
				value: '',
			} }, function (err, results) {
				demand(_.map(results, 'text1')).eql([
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
			filter({ text1: {
				mode: 'exactly',
				value: ' ',
			} }, function (err, results) {
				demand(results.length).be(1);
				demand(results[0].text1).be(' ');
				done();
			});
		});

		it('should work with special characters', function (done) {
			filter({ text1: {
				mode: 'exactly',
				value: 'a/b\c@d',
			} }, function (err, results) {
				demand(results.length).be(1);
				demand(results[0].text1).be('a/b\c@d');
				done();
			});
		});

		it('should be case insensitive by default', function (done) {
			filter({ text1: {
				mode: 'exactly',
				value: 'abcd',
			} }, function (err, results) {
				demand(results.length).be(2);
				demand(results[0].text1).be('ABCD');
				demand(results[1].text1).be('abcd');
				done();
			});
		});

		it('should allow case sensitivity', function (done) {
			filter({ text1: {
				caseSensitive: true,
				mode: 'exactly',
				value: 'abcd',
			} }, function (err, results) {
				demand(results.length).be(1);
				demand(results[0].text1).be('abcd');
				done();
			});
		});

		it('should combine correctly', function (done) {
			filter({
				text1: {
					mode: 'exactly',
					value: 'abcd',
				},
				text2: {
					mode: 'exactly',
					value: '123',
				},
			}, function (err, results) {
				demand(results.length).be(1);
				demand(results[0].text1).be('abcd');
				done();
			});
		});
	});

	describe('beginsWith', function () {

		it('should match the start of strings', function (done) {
			filter({ text1: {
				mode: 'beginsWith',
				value: 'abc',
			} }, function (err, results) {
				demand(_.map(results, 'text1')).eql([
					'abc',
					'ABCD',
					'abcd',
				]);
				done();
			});
		});

		it('should invert correctly', function (done) {
			filter({ text1: {
				mode: 'beginsWith',
				inverted: true,
				value: 'abc',
			} }, function (err, results) {
				demand(_.map(results, 'text1')).eql([
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
			filter({ text1: {
				mode: 'endsWith',
				value: 'cd',
			} }, function (err, results) {
				demand(_.map(results, 'text1')).eql([
					'ABCD',
					'abcd',
					'Ab Cd',
				]);
				done();
			});
		});

		it('should invert correctly', function (done) {
			filter({ text1: {
				mode: 'endsWith',
				inverted: true,
				value: 'cd',
			} }, function (err, results) {
				demand(_.map(results, 'text1')).eql([
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
