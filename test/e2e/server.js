var async = require('async');
var keystone = require('../..');
var ReactEngine = require('react-engine');
var view = require('react-engine/lib/expressView');
var engine = ReactEngine.server.create({});
var request = require('superagent');
var moment = require('moment');
var mongoose = require('mongoose');
var Nightwatch = require('nightwatch/lib/index.js');
var child_process = require('child_process');
var path = require('path');

var dbName = '/e2e' + (process.env.KEYSTONEJS_PORT || 3000);
var mongoUri = 'mongodb://' + (process.env.KEYSTONEJS_HOST || '127.0.0.1') + dbName;

var selenium = null;

keystone.init({
	'name': 'e2e',
	'brand': 'e2e',

	'host': process.env.KEYSTONEJS_HOST || '127.0.0.1',
	'port': process.env.KEYSTONEJS_PORT || 3000,

	'mongo': mongoUri,

	'less': 'public',
	'static': 'public',
	'favicon': 'adminuiCustom/favicon.ico',
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

	'cloudinary config': 'cloudinary://api_key:api_secret@cloud_name',

	'codemirror url path': '/keystone/js/lib/codemirror'
});

keystone.import('models');
keystone.set('routes', require('./routes'));
keystone.set('nav', {
	'access': [
		'users',
	],
	'fields': [
		'booleans',
		'cloudinary-images',
		'cloudinary-image-multiples',
		'codes',
		'colors',
		'dates',
		'date-arrays',
		'datetimes',
		'emails',
		'geo-points',
		'htmls',
		'keys',
		'local-files',
		'local-file-multiples',
		'locations',
		'markdowns',
		'money',
		'names',
		'numbers',
		'number-arrays',
		'passwords',
		'relationships',
		'selects',
		'texts',
		'text-arrays',
		'textareas',
		'urls',
	],
	'Miscs': [
		'depends-ons',
		'inline-relationships',
		'many-relationships',
		'hidden-relationships',
		'many-relationships',
		'nameless-relationships',
		'no-default-columns',
		'source-relationships',
		'target-relationships',
	]
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

function checkKeystoneReady (done) {
	async.retry({
		times: 10,
		interval: 3000
	}, function(done, result) {
		console.log([moment().format('HH:mm:ss:SSS')] + ' e2e: checking if KeystoneJS ready for request');
		request
			.get('http://' + keystone.get('host') + ':' + keystone.get('port') + '/keystone')
			.end(done);
	}, function (err, result) {
		if (!err) {
			console.log([moment().format('HH:mm:ss:SSS')] + ' e2e: KeystoneJS Ready!');
			done();
		} else {
			console.log([moment().format('HH:mm:ss:SSS')] + ' e2e: KeystoneJS does not appear ready!');
			done(err);
		}
	})
}

/*
On some machines, selenium fails with a timeout error when nightwatch tries to connect due to a
deadlock situation. The following is a temporary workaround that starts selenium without a pipe
from stdin until this issue is fixed in nightwatch:
https://github.com/nightwatchjs/nightwatch/issues/470
*/
function runSeleniumInBackground (done) {
	console.log([moment().format('HH:mm:ss:SSS')] + ' e2e: starting selenium server in background...');
	selenium = child_process.spawn('java',
	[
		'-jar',
		path.join(__dirname, 'bin/selenium-server-standalone-2.53.0.jar')
	],
	{
		stdio: ['ignore', 'pipe', 'pipe']
	});
	var running = false;

	selenium.stderr.on('data', function (buffer)
	{
	  var line = buffer.toString();
	  if(line.search(/Selenium Server is up and running/g) != -1) {
			console.log([moment().format('HH:mm:ss:SSS')] + ' e2e: selenium server running in background...');
			running = true;
			done();
	  }
	});

	selenium.on('close', function (code) {
		if(!running) {
			console.log([moment().format('HH:mm:ss:SSS')] + ' e2e: selenium server run error...');
			done(new Error('Selenium exited with error code ' + code));
		}
	});
}

function runNightwatch (done) {
	console.log([moment().format('HH:mm:ss:SSS')] + ' e2e: starting tests...');

	try {
		Nightwatch.cli(function (argv) {
			Nightwatch.runner(argv, function () {
				console.log([moment().format('HH:mm:ss:SSS')] + ' e2e: finished tests...');
				done();
			});
		});
	} catch (ex) {
		console.error('\nThere was an error while starting the nightwatch test runner:\n\n');
		process.stderr.write(ex.stack + '\n');
		done("failed to run nightwatch!");
	}
}

function runKeystone(cb) {
	console.log([moment().format('HH:mm:ss:SSS')] + ' e2e: starting KeystoneJS...');

	keystone.start({
		onMount: function () {
			console.log([moment().format('HH:mm:ss:SSS')] + ' e2e: KeystoneJS mounted Successfuly');
		},
		onStart: function() {
			console.log([moment().format('HH:mm:ss:SSS')] + ' e2e: KeystoneJS Started Successfully');
			cb();
		},
	});
}

function start() {
	var runTests = process.argv.indexOf('--notest') === -1;
	var dropDB = process.argv.indexOf('--nodrop') === -1;
	var runSelenium = process.argv.indexOf('--selenium-in-background') !== -1;

	async.series([

		function (cb) {
			if (dropDB) {
				dropTestDatabase(cb);
			}	else {
				cb();
			}
		},

		function (cb) {
			runKeystone(cb);
		},

		function (cb) {
			checkKeystoneReady(cb);
		},

		function (cb) {
			if (runTests && runSelenium) {
				runSeleniumInBackground(cb)
			}	else {
				cb();
			}
		},

		function (cb) {
			if (runTests) {
				runNightwatch(cb);
			} else {
				cb();
			}
		}

	], function(err) {
		var exitProcess = false;
		if (err) {
			console.error([moment().format('HH:mm:ss:SSS')] + ' e2e: ' + err);
			exitProcess = true;
		}
		if (selenium) {
			selenium.kill('SIGHUP');
			exitProcess = true;
		}
		if (runTests) {
			exitProcess = true;
		}
		if (exitProcess) {
			process.exit();
		}
	});
}

start();
