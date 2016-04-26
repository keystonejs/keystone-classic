var keystone = require('../../index.js');
var request = require('supertest');
var demand = require('must');
var getExpressApp = require('../helpers/getExpressApp');
var removeModel = require('../helpers/removeModel');

describe('List schema pre/post save hooks', function () {
	var app = getExpressApp();
	var dummyUser = { _id: 'USERID' };
	var Test;
	var pre;
	var post;

	before(function () {
		// in case other modules didn't cleanup
		removeModel('Test');

		// create test model
		Test = keystone.List('Test'),
		Test.add({ name: { type: String } });
		Test.schema.pre('save', function (next, done) {
			pre = this._req_user;
			next();
		});

		Test.schema.post('save', function () {
			post = this._req_user;
		});

		Test.register();
	});

	// cleanup
	after(function () {
		removeModel('Test');
	});

	describe('when using UpdateHandler()', function () {

		it('should receive ._req_user', function (done) {
			pre = undefined;
			post = undefined;

			app.post('/using-update-handler', function (req, res) {
				var item = new Test.model();
				req.user = dummyUser;
				var updateHandler = item.getUpdateHandler(req);
				updateHandler.process(req.body, function (err, data) {
					if (err) {
						res.send('BAD');
					} else {
						res.send('GOOD');
					}
				});
			});

			request(app)
				.post('/using-update-handler')
				.send({ name: 'test' })
				.expect('GOOD')
				.end(function (err, res) {
					if (err) return done(err);
					demand(pre).be(dummyUser);
					demand(post).be(dummyUser);
					done();
				});
		});
	});

	describe('when using .save()', function () {

		it('should not receive ._req_user', function  (done) {
			pre = undefined;
			post = undefined;

			app.post('/using-save', function (req, res) {
				req.user = dummyUser;
				var item = new Test.model(req.body);
				item.save(function (err, data) {
					if (err) {
						res.send('BAD');
					} else {
						res.send('GOOD');
					}
				});
			});

			request(app)
				.post('/using-save')
				.send({ name: 'test' })
				.expect('GOOD')
				.end(function (err, res) {
					if (err) return done(err);
					demand(pre).be.undefined();
					demand(post).be.undefined();
					done();
				});
		});
	});

});
