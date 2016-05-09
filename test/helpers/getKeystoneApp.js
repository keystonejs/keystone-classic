var keystone = require('../../index.js');
var request = require('supertest');
var _ = require('lodash');
var exec = require('child_process').exec;

function testApp(request, page , server, done) {
	server = server || keystone.httpServer;
	request
		.get(page || '/')
		.expect(200)
		.end(function(err, res){
			if (err) return done(err);
			server.close();
			done();
		});

}

var routes = function(app){
	app.get('*', function(req,res) {
		res.sendStatus(200)
	})
}
exports.startHttp = function startHttp(cb) {
	keystone.app = false;
	keystone.mongoose = false;
	keystone.init({
		'cookie secret': 'test',
		'auth': false,
		'port': '4000'
	})
	.set('routes', routes)
	.start({
		onStart: function(){
			if('function' == typeof cb) {
				testApp(request('http://@:4000'), false, keystone.httpServer, function(err) {
					if(err) {
						console.log(err)
						return cb(false);
					}
					return cb(true);
				});
			}
		}
	});

}

exports.startHttps = function startHttps(cb) {
	keystone.app = false;
	keystone.mongoose = false;
	keystone.init({
		'cookie secret': 'test',
		'ssl': 'only',
		'ssl key': './certs/server.ca.key',
		'ssl cert': './certs/server.crt',
		'auth': false,
		'ssl port': '4001'
	})
	.set('routes', routes)
	.start({
		onStart: function(){
			if('function' == typeof cb) {
				testApp(request('https://@:4001'), '/', keystone.httpsServer, function(err) {
					if(err) {
						return cb(false);
					}
					return cb(true);
				});
			}
		}
	});
}

exports.startSocket = function startSocket(cb) {
	keystone.app = false;
	keystone.mongoose = false;
	keystone.init({
		'cookie secret': 'test',
		'unix socket': '/tmp/testKeystoneUnixSocket',
		'auth': false,
		'name': 'Test Site'
	})
	.set('routes', routes)
	.start({
		onStart: function(){
			testApp(request(keystone.app), '/', keystone.httpServer, function(err) {
				if(err) {
					return cb(false);
				}
				return cb(true);
			});
		}
	});
}
