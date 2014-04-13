var demand = require('must'),
	di = require('../../lib/asyncdi');

var fn_basic = function() { return true; };
var fn_async = function(callback) { callback(null, true) };

describe('asyncdi', function() {
	describe('new', function() {
		it('must be an instance of Wrapper', function() {
			new di.Wrapper(fn_basic).must.be.an.instanceof(di.Wrapper);
		});
	});
	describe('()', function() {
		it('must be an instance of Wrapper', function() {
			di(fn_basic).must.be.an.instanceof(di.Wrapper);
		});
	});
	describe('fn_basic.isAsync', function() {
		it('must not be async', function() {
			demand(di(fn_basic).isAsync).not.be.true();
		});
	});
	describe('fn_async.isAsync', function() {
		it('must be async', function() {
			demand(di(fn_async).isAsync).be.true();
		});
	});
	describe('fn_basic.call(callback)', function() {
		it('must callback(null, true)', function(done) {
			di(fn_basic).call(function(err, val) {
				demand(err).be.null();
				demand(val).be.true();
				done();
			});
		});
	});
	describe('fn_basic.call()', function() {
		it('must return true', function() {
			di(fn_basic).call().must.be.true();
		});
	});
	describe('fn_async.call(callback)', function() {
		it('must callback(null, true)', function(done) {
			di(fn_async).call(function(err, val) {
				demand(err).be.null();
				demand(val).be.true();
				done();
			});
		});
	});
})
