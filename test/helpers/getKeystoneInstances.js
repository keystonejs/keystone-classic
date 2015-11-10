var mongoose = require('mongoose');
var moduleRoot = require('../../lib/core/getModulePath')(module.parent || module);
var createKeystones = require('../../registry.js');
var keystone = createKeystones.create('keystoneHttp', moduleRoot);
var keystoneSSL = new createKeystones.create('keystoneSSL', moduleRoot);
var keystoneSocket = new createKeystones.create('keystoneSocket', moduleRoot);
var request = require('supertest');
var _ = require('underscore');

var exports = module.exports = {};


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
	app.get('/httpModel', function(req,res) {
		var list = keystone.lists['httpModel'];
		var newPost = new list.model({
			name: 'httpModel'
		});
		newPost.save(function(err) {
			console.log('httplist',err);
			if(err) return res.sendStatus(404)
			res.sendStatus(200)	
		});
	});
	app.get('/httpSSL', function(req,res) {
		var list = keystoneSSL.lists['sslModel'];
		var newPost = new list.model({
			name: 'sslModel'
		});
		newPost.save(function(err) {
			if(err) return res.sendStatus(404)
			res.sendStatus(200)	
		});
	});
	app.get('/httpSocket', function(req,res) {
		var list = keystoneSocket.lists['socketModel'];
		var newPost = new list.model({
			name: 'socketModel'
		});
		newPost.save(function(err) {
			if(err) return res.sendStatus(404)
			res.sendStatus(200)	
		});
	});
	app.get('*', function(req,res) {
		res.sendStatus(200)
	});
}

function createModel(key, name, cb) {
	removeModel(key, name, function() {
		//console.log(key);
		var Test = new key.List(name);
		Test.add({ name: { type: String } });
		Test.register();
		cb();
	});
}

function removeModel(key, name, cb) {
	if(key.mongoose) {
		delete key.mongoose.models[name];
		delete key.mongoose.modelSchemas[name];
	}
	cb();
}

exports.startHttp = function startHttp(cb) {
	//console.log(keystone);
	createModel(keystone, 'httpModel', function() {
		keystone.init({
			'cookie secret': 'test',
			'auth': false,
			//'port': '4000',
			//'mongoose': mongoose
		})
		.set('routes', routes)
		.start({
			onStart: function(){
				if('function' == typeof cb) {
					testApp(request('http://@:3000'), '/httpModel', keystone.httpServer, function(err) {
						if(err) {
							console.log(err)
							return cb(false);
						}
						return cb(true);
					});
				}
			}
		});
	});
}

exports.startHttps = function startHttps(cb) {
	createModel(keystoneSSL, 'sslModel', function() {
		keystoneSSL.init({
			'cookie secret': 'test',
			'ssl': 'only',
			'brand': 'ssl',
			'ssl key': './helpers/certs/server.ca.key',
			'ssl cert': './helpers/certs/server.crt',
			'auth': false,
			'ssl port': '4001',
			//'mongoose': new mongoose.Mongoose()
		})
		.set('routes', routes)
		.start({
			onStart: function(){
				if('function' == typeof cb) {
					testApp(request('https://@:4001'), '/httpSSL', keystoneSSL.httpsServer, function(err) {
						if(err) {
							return cb(false);
						}
						return cb(true);
					});
				}
			}
		});
	});
}

exports.startSocket = function startSocket(cb) {
	createModel(keystoneSocket, 'socketModel', function() {
		keystoneSocket.init({
			'cookie secret': 'test',
			'unix socket': '/tmp/testKeystoneUnixSocket',
			'auth': false,
			'name': 'Test Site',
			//'mongoose': new mongoose.Mongoose()
		})
		.set('routes', routes)
		.start({
			onStart: function(){
				testApp(request(keystoneSocket.app), '/httpSocket', keystoneSocket.httpServer, function(err) {
					if(err) {
						return cb(false);
					}
					return cb(true);
				});	
			}
		});
	});
}
