var keystone = require('../..');
var ReactEngine = require('react-engine');
var view = require('react-engine/lib/expressView');
var engine = ReactEngine.server.create({});
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

keystone.import('../models');

keystone.start({
	onMount: function(){
		console.log('KeystoneJS Mounted Successfuly');
	},
	onStart: function() {
		console.log('KeystoneJS Started Successfully');
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
	},
});
