var demand = require('must'),
	di = require('../../lib/asyncdi');

var thrownErr = new Error("Should've been caught by asyncdi");

var fn_basic = function() { return true; };
var fn_async = function(callback) { setTimeout(callback, 500, null, true) };
var fn_one = function(one) { return true; };
var fn_scope = function(){ return this; };
var fn_error = function() { throw thrownErr };
var scope = {};
var notAFunction = {};

describe('AsyncDI', function() {
	describe('new Wrapper', function() {
		it('must be an instance of Wrapper', function() {
			new di.Wrapper(fn_basic).must.be.an.instanceof(di.Wrapper);
		});
	});
	describe('()', function() {
		it('must be an instance of Wrapper', function() {
			di(fn_basic).must.be.an.instanceof(di.Wrapper);
		});
	});
	describe('(notAFunction)', function(){
		it('must throw an error', function(){
			demand(function(){
				di(notAFunction);
			}).to.throw(/function/i);
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
	describe('fn_one.requires', function() {
		it('must require `one`', function() {
			demand(di(fn_one).requires.one).be.true();
		});
	});
	describe('fn_one.requires', function() {
		it('must not require `two`', function() {
			demand(di(fn_one).requires.two).be.undefined();
		});
	});
	describe('(fn_scope).call(scope, callback)', function(){
		it('must return scope', function(done){
			di(fn_scope).call(scope, function(err, val){
				demand(val).equal(scope);
				done();
			});
		});
	});
	describe('(fn_scope, scope).call(callback)', function(){
		it('must return scope', function(done){
			di(fn_scope, scope).call(function(err, val){
				demand(val).equal(scope);
				done();
			});
		});
	});
	describe('(fn_error).call(callback)', function(){
		it('must return thrownErr', function(done){
			di(fn_error).call(function(err, val){
				demand(err).equal(thrownErr);
				done();
			});
		});
	});
});
