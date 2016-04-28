var express = require('express');
var demand = require('must');

var ReactEngine = require('react-engine');
var view = require('react-engine/lib/expressView');

var engine = ReactEngine.server.create({});

var init = require('../../../server/initViewEngine.js');

var options = {

	'name': 'foo',
	'brand': 'foo',

	'less': 'public',
	'static': 'public',
	'favicon': 'public/favicon.ico',
	'views': 'templates/views',
	'view engine': '.jsx',
	'custom engine': engine,
	'view': view,

	'auto update': true,
	'session': true,
	'auth': true,
	'user model': 'User',
	'cookie secret': 'Secret',

};

describe("initViewEngine", function () {
	var keystone = require('../../../index.js');
	var app = express();
	keystone.init(options);
	keystone.set('app', app);
	it("should set view", function () {
		demand(typeof app.get('view')).must.be('function');
	});
});
