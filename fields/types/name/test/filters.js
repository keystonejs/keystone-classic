var demand = require('must');
var NameType = require('../NameType');

exports.initList = function (List) {
	List.add({
		name: NameType,
	});
};

function getTestItems () {
	return [
		{
			name: {},
		},
		{
			name: {
				first: '',
				last: '',
			},
		},
		{
			name: {
				first: ' ',
				last: ' ',
			},
		},
		{
			name: {
				first: 'abc',
				last: 'def',
			},
		},
		{
			name: {
				first: 'ABCD',
				last: 'EFGH',
			},
		},
		{
			name: {
				first: 'abcd',
				last: 'efgh',
			},
		},
		{
			name: {
				first: 'Ab Cd',
				last: 'Ef Gh',
			},
		},
		{
			name: {
				first: 'a/b\c@d',
				last: 'e/f\g@h',
			},
		},
	];
};

exports.getTestItems = getTestItems;

exports.testFilters = function (List, filter) {
	it('should find the first name', function (done) {
		filter({
			name: {
				mode: 'exactly',
				value: 'abc',
			},
		}, 'name', function (results) {
			demand(results.length).be(1);
			demand(results[0].first).eql('abc');
			demand(results[0].last).eql('def');
			done();
		});
	});

	it('should find the last name', function (done) {
		filter({
			name: {
				mode: 'exactly',
				value: 'def',
			},
		}, 'name', function (results) {
			demand(results.length).be(1);
			demand(results[0].first).eql('abc');
			demand(results[0].last).eql('def');
			done();
		});
	});

	it('should support inverted filtering', function (done) {
		filter({
			name: {
				mode: 'exactly',
				value: 'abc',
				inverted: true,
			},
		}, 'name', function (results) {
			demand(results.length).be(getTestItems().length - 1);
			done();
		});
	});

	it('should find beginsWith matches', function (done) {
		filter({
			name: {
				mode: 'beginsWith',
				value: 'ab',
			},
		}, 'name', function (results) {
			demand(results.length).be(4);
			demand(results[0].first).eql('abc');
			demand(results[0].last).eql('def');
			demand(results[1].first).eql('ABCD');
			demand(results[1].last).eql('EFGH');
			demand(results[2].first).eql('abcd');
			demand(results[2].last).eql('efgh');
			demand(results[3].first).eql('Ab Cd');
			demand(results[3].last).eql('Ef Gh');
			done();
		});
	});

	it('should support case sensitive filtering', function (done) {
		filter({
			name: {
				mode: 'beginsWith',
				value: 'ab',
				caseSensitive: true,
			},
		}, 'name', function (results) {
			demand(results.length).be(2);
			demand(results[0].first).eql('abc');
			demand(results[0].last).eql('def');
			demand(results[1].first).eql('abcd');
			demand(results[1].last).eql('efgh');
			done();
		});
	});

	it('should find endsWith matches', function (done) {
		filter({
			name: {
				mode: 'endsWith',
				value: 'c',
			},
		}, 'name', function (results) {
			demand(results.length).be(1);
			demand(results[0].first).eql('abc');
			demand(results[0].last).eql('def');
			done();
		});
	});

	it('should find empty values', function (done) {
		filter({
			name: {
				mode: 'exactly',
			},
		}, 'name', function (results) {
			demand(results.length).be(2);
			done();
		});
	});

	it('should find non-empty values', function (done) {
		filter({
			name: {
				mode: 'exactly',
				inverted: true,
			},
		}, 'name', function (results) {
			demand(results.length).be(getTestItems().length - 2);
			done();
		});
	});
};
