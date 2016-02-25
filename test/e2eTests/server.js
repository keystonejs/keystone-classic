var async = require('async');
var keystone = require('../..');
var ReactEngine = require('react-engine');
var view = require('react-engine/lib/expressView');
var engine = ReactEngine.server.create({});
var request = require('superagent');
var moment = require('moment');
var Nightwatch = require('nightwatch/lib/index.js');

keystone.init({
	'name': 'e2e',
	'brand': 'e2e',

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
});

keystone.import('models');

keystone.set('nav', {
	'access': ['users'],
	'fields': ['name-fields'],
});

function checkKeystoneReady(callback, results){
	console.log([moment().format('HH:mm:ss:SSS')] + ' e2e: checking if KeystoneJS ready for request.');
	request
		.get('http://localhost:3000/keystone')
		.end(callback);
}

function runNightwatch() {
	try {
		Nightwatch.cli(function(argv) {
			Nightwatch.runner(argv, function(){
				process.exit();
			});
		});
	} catch (ex) {
		console.error('\nThere was an error while starting the nightwatch test runner:\n\n');
		process.stderr.write(ex.stack + '\n');
		process.exit(2);
	}
}

console.log([moment().format('HH:mm:ss:SSS')] + ' e2e: starting KeystoneJS...');

keystone.start({
	onMount: function(){
		console.log([moment().format('HH:mm:ss:SSS')] + ' e2e: KeystoneJS mounted Successfuly');
	},
	onStart: function() {
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
