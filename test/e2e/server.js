var async = require('async');
var keystone = require('../..');
var ReactEngine = require('react-engine');
var view = require('react-engine/lib/expressView');
var engine = ReactEngine.server.create({});
var request = require('superagent');
var moment = require('moment');
var mongoose = require('mongoose');
var Nightwatch = require('nightwatch/lib/index.js');

var dbName = '/e2e' + (process.env.KEYSTONEJS_PORT || 3000);
var mongoUri = 'mongodb://' + (process.env.KEYSTONEJS_HOST || 'localhost') + dbName;

keystone.init({
	'name': 'e2e',
	'brand': 'e2e',

	'host': process.env.KEYSTONEJS_HOST || 'localhost',
	'port': process.env.KEYSTONEJS_PORT || 3000,

	'mongo': mongoUri,

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
	'adminui custom styles': 'adminuiCustom/styles.less',
});

keystone.import('models');
keystone.set('routes', require('./routes'));

keystone.set('nav', {
	'access': [
		'users',
	],
	'fields': [
		'booleans',
		'codes',
		'emails',
		'names',
		'numbers',
		'selects',
	],
});

function dropTestDatabase(done) {
	console.log([moment().format('HH:mm:ss:SSS')] + ' e2e: dropping test database');

	mongoose.connect(mongoUri,function(err){
		if (!err) {
			mongoose.connection.db.dropDatabase(function (err) {
				mongoose.connection.close(function(err) {
					done(err);
				})
			});
		} else {
			console.error([moment().format('HH:mm:ss:SSS')] + ' e2e: failed to connect to mongo: ' + err);
			done(err);
		}
	});
}

function checkKeystoneReady (done, results) {
	console.log([moment().format('HH:mm:ss:SSS')] + ' e2e: checking if KeystoneJS ready for request');
	request
		.get('http://localhost:3000/keystone')
		.end(done);
}

function runNightwatch () {
	console.log([moment().format('HH:mm:ss:SSS')] + ' e2e: starting tests...');

	try {
		Nightwatch.cli(function (argv) {
			Nightwatch.runner(argv, function () {
				process.exit();
			});
		});
	} catch (ex) {
		console.error('\nThere was an error while starting the nightwatch test runner:\n\n');
		process.stderr.write(ex.stack + '\n');
		process.exit(2);
	}
}

function runKeystone() {
	console.log([moment().format('HH:mm:ss:SSS')] + ' e2e: starting KeystoneJS...');

	keystone.start({
		onMount: function () {
			console.log([moment().format('HH:mm:ss:SSS')] + ' e2e: KeystoneJS mounted Successfuly');
		},
		onStart: function () {
			console.log([moment().format('HH:mm:ss:SSS')] + ' e2e: KeystoneJS Started Successfully');

			// if --notest was specified then do not run the test; the user wants to
			// just run the keystone server app.
			if (process.argv.indexOf('--notest') == -1) {
				// make sure keystone returns 200 before starting Nightwatch testing
				async.retry({times: 10, interval: 3000}, checkKeystoneReady, function (err, result) {
					if (!err) {
						console.log([moment().format('HH:mm:ss:SSS')] + ' e2e: KeystoneJS Ready!');
						runNightwatch();
					} else {
						console.log([moment().format('HH:mm:ss:SSS')] + ' e2e: Nightwatch tests not ran!');
						process.exit();
					}
				})
			}
		},
	});
}

function start() {
	dropTestDatabase(function (err) {
		console.log([moment().format('HH:mm:ss:SSS')] + ' e2e: starting setup');

		if (!err) {
			runKeystone();
		} else {
			console.error([moment().format('HH:mm:ss:SSS')] + ' e2e: failed to drop e2e test database: ' + err);
		}
	});
}

start();
