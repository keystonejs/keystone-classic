var demand = require('must');
var moment = require('moment');

exports.initList = function (List) {
	List.add({
		date: Date,
	});
};

exports.getTestItems = function () {
	return [
		{},
		{ date: '2015-01-01' },
		{ date: moment('2015-01-01') },
		{ date: moment('2014-01-01').toDate() },
		{ date: new Date() },
	];
};

exports.testFilters = function (List, filter) {
	it('should find a specific date', function (done) {
		filter({
			date: {
				value: '2015-01-01',
			},
		}, 'date', function (results) {
			demand(results.length).be(2);
			done();
		});
	});

	it('should find all records after a specific date', function (done) {
		filter({
			date: {
				value: '2014-12-31',
				mode: 'after',
			},
		}, 'date', function (results) {
			demand(results.length).be(3);
			done();
		});
	});

	it('should find all records after a specific date starting at the end of the day', function (done) {
		filter({
			date: {
				value: '2015-01-01',
				mode: 'after',
			},
		}, 'date', function (results) {
			demand(results.length).be(1);
			done();
		});
	});

	it('should find all records before a specific date', function (done) {
		filter({
			date: {
				value: '2014-12-31',
				mode: 'before',
			},
		}, 'date', function (results) {
			demand(results.length).be(1);
			done();
		});
	});

	it('should find all records before a specific date starting at the start of the day', function (done) {
		filter({
			date: {
				value: '2015-01-01',
				mode: 'before',
			},
		}, 'date', function (results) {
			demand(results.length).be(1);
			done();
		});
	});

	it('should find records between two dates', function (done) {
		filter({
			date: {
				after: '2014-12-31',
				before: '2015-01-02',
				mode: 'between',
			},
		}, 'date', function (results) {
			demand(results.length).be(2);
			done();
		});
	});

	it('should find records between two dates after the start of the end until the end of the day', function (done) {
		filter({
			date: {
				after: '2015-01-01',
				before: '2015-01-01',
				mode: 'between',
			},
		}, 'date', function (results) {
			demand(results.length).be(2);
			done();
		});
	});

	it('should find records in inverted mode', function (done) {
		filter({
			date: {
				value: '2015-01-01',
			},
			inverted: true,
		}, 'date', function (results) {
			demand(results.length).be(2);
			done();
		});
	});

	it('should find everything in between mode if no dates are specified', function (done) {
		filter({
			date: {
				mode: 'between',
			},
		}, 'date', function (results) {
			demand(results.length).be(5);
			done();
		});
	});
};
