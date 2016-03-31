var demand = require('must');
var request = require('supertest');
var methodOverride = require('method-override');
var bodyParser = require('body-parser');
var keystone = require('../../../index.js');

var getApp = function () {
	var app = keystone.express();
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({
		extended: true,
	}));
	app.use(methodOverride());
	return app;
};

describe('Keystone.View', function () {

	describe('new', function () {
		it('must be an instance of View', function (done) {
			var app = getApp();
			app.get('/', function (req, res) {
				var view = new keystone.View(req, res);
				view.must.be.an.instanceof(keystone.View);
				res.send('OK');
			});
			request(app)
				.get('/')
				.expect('OK', done);
		});
	});

	describe('.render(callback)', function () {
		it('must call the callback function', function (done) {
			var app = getApp();
			app.get('/', function (req, res) {
				var view = new keystone.View(req, res);
				view.render(function () {
					res.send('OK');
				});
			});
			request(app)
				.get('/')
				.expect('OK', done);
		});
	});

	describe('.render(callback)', function () {
		it('must pass (err, req, res) to the callback', function (done) {
			var app = getApp();
			app.get('/', function (req, res) {
				var view = new keystone.View(req, res);
				view.render(function (err, req2, res2) {
					demand(err).not.exist();
					req2.must.equal(req);
					res2.must.equal(res);
					res.send('OK');
				});
			});
			request(app)
				.get('/')
				.expect('OK', done);
		});
	});

	describe('.on(event, [match,] fn)', function () {

		it('must call init methods first', function (done) {
			var app = getApp();
			app.get('/', function (req, res) {
				var view = new keystone.View(req, res);
				var status = 'NOT OK';
				view.on('init', function (next) {
					status = 'OK';
					next();
				});
				view.render(function () {
					res.send(status);
				});
			});
			request(app)
				.get('/')
				.expect('OK', done);
		});

		function getApp_getAndPost() {
			var app = getApp();
			app.all('/', function (req, res) {
				var view = new keystone.View(req, res);
				var status = 'OK';
				view.on('get', function (next) {
					status = 'OK GET';
					next();
				});
				view.on('post', function (next) {
					status = 'OK POST';
					next();
				});
				view.render(function () {
					res.send(status);
				});
			});
			return app;
		}

		it('must call get actions correctly', function (done) {
			request(getApp_getAndPost())
				.get('/')
				.expect('OK GET', done);
		});

		it('must call post actions correctly', function (done) {
			request(getApp_getAndPost())
				.post('/')
				.expect('OK POST', done);
		});

		function getApp_conditionalGet() {
			var app = getApp();
			app.get('/', function (req, res) {
				var view = new keystone.View(req, res);
				var status = 'OK';
				view.on('get', { test: 'yes' }, function (next) {
					status = 'OK GET';
					next();
				});
				view.render(function () {
					res.send(status);
				});
			});
			return app;
		}

		it('must invoke get actions with matching query parameters', function (done) {
			request(getApp_conditionalGet())
				.get('/?test=yes')
				.expect('OK GET', done);
		});

		it('must skip get actions without matching query parameters', function (done) {
			request(getApp_conditionalGet())
				.get('/')
				.expect('OK', done);
		});

		function getApp_conditionalPostValue() {
			var app = getApp();
			app.post('/', function (req, res) {
				var view = new keystone.View(req, res);
				var status = 'OK';
				view.on('post', { test: 'yes' }, function (next) {
					status = 'OK POST';
					next();
				});
				view.render(function () {
					res.send(status);
				});
			});
			return app;
		}

		it('must invoke post actions with matching body data', function (done) {
			request(getApp_conditionalPostValue())
				.post('/')
				.send({ test: 'yes' })
				.expect('OK POST', done);
		});

		it('must skip post actions with non-matching body data', function (done) {
			request(getApp_conditionalPostValue())
				.post('/')
				.send({ test: 'no' })
				.expect('OK', done);
		});

		function getApp_conditionalPostTruthy() {
			var app = getApp();
			app.post('/', function (req, res) {
				var view = new keystone.View(req, res);
				var status = 'OK';
				view.on('post', { test: true }, function (next) {
					status = 'OK POST';
					next();
				});
				view.render(function () {
					res.send(status);
				});
			});
			return app;
		}

		it('must invoke post actions with body data present', function (done) {
			request(getApp_conditionalPostTruthy())
				.post('/')
				.send({ test: 'yes' })
				.expect('OK POST', done);
		});

		it('must skip post actions without matching body data', function (done) {
			request(getApp_conditionalPostTruthy())
				.post('/')
				.expect('OK', done);
		});

		function getApp_extRequest() {
			var app = getApp();
			app.get('/', function (req, res) {
				req.ext = { prop: 'value' };
				var view = new keystone.View(req, res);
				var status = 'NOT OK';
				view.on({ 'ext.prop': 'value' }, function (next) {
					status = 'OK';
					next();
				});
				view.render(function () {
					res.send(status);
				});
			});
			return app;
		}

		it('must invoke actions based on req properties', function (done) {
			request(getApp_extRequest())
				.get('/')
				.expect('OK', done);
		});

	});

});
