var keystone = require('../index.js'),
	request = require('supertest'),
	demand = require('must'),
	mongoose = require('mongoose');

var getExpressApp = function() {
	var expressApp;

	mongoose.connect('mongodb://localhost/test');

	keystone.init();
	expressApp = keystone.express();

	expressApp.use(keystone.express.bodyParser());
	expressApp.use(keystone.express.methodOverride());
	return expressApp;
};

describe('List schema pre/post save hooks', function() {
	var app = getExpressApp(),
		Test = keystone.List('TestReqUser'),
		dummyUser = { _id: 'USERID' },
		pre, post;

	before(function() {
		Test.add({ name: { type: String } });
		Test.schema.pre('save', function(next, done) {
			pre = this._req_user;
			next();
		});

		Test.schema.post('save', function() {
			post = this._req_user;
		});

		Test.register();
	});

	describe('when using UpdateHandler()', function() {

		it('should receive ._req_user', function (done) {
			pre = undefined;
			post = undefined;

			app.post('/using-update-handler', function(req, res) {
				var item = new Test.model();
				req.user = dummyUser;
				var updateHandler = item.getUpdateHandler(req);
				updateHandler.process(req.body, function(err, data) {
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
				.end(function(err, res){
					if (err) return done(err);
					demand(pre).be(dummyUser);
					demand(post).be(dummyUser);
					done();
				});

		});

	});

	describe('when using .save()', function() {

		it('should not receive ._req_user', function (done) {
			pre = undefined;
			post = undefined;

			app.post('/using-save', function(req, res) {
				req.user = dummyUser;
				var item = new Test.model(req.body);
				item.save(function(err, data) {
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
				.end(function(err, res){
					if (err) return done(err);
					demand(pre).be.undefined();
					demand(post).be.undefined();
					done();
				});

		});

	});

});
