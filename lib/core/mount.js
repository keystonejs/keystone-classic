/**
 * Configures a Keystone app in encapsulated mode, but does not start it.
 *
 * Connects to the database and runs updates and then calls back.
 *
 * This is the code-path to use if you'd like to mount the keystone app as a sub-app in another express application.
 *
 *   var app = express();
 *
 *   //...do your normal express setup stuff, add middleware and routes (but not static content or error handling middleware yet)
 *
 *   keystone.mount('/content', app, function() {
 *	 //put your app's static content and error handling middleware here and start your server
 *   });
 *
 * Events are fired during the initialisation of each module to allow customisation
 *
 *   - beforeDefault
 *   - customDefault // must be accompanied by skipDefault = 'skip'
 *   - afterDefault
 * 
 * When mounted a final event is fired
 * 
 *   - onMount
 *
 * If the events argument is a function, it is assumed to be the mounted event.
 *
 *
 * ####Options:
 *
 * Keystone supports the following options specifically for running in encapsulated mode (with no embedded server):
 *
 *   - name
 *   - port
 *   - views
 *   - view engine
 *   - compress
 *   - favico
 *   - less
 *   - static
 *   - headless
 *   - logger
 *   - cookie secret
 *   - session
 *   - 404
 *   - 500
 *   - routes
 *   - locals
 *   - auto update
 *
 *
 * @api public
 */

var _ = require('underscore'),
	express = require('express'),
	path = require('path'),
	utils = require('keystone-utils'),
	mountDefaults = {
		session : require('./mount/session.js'),
		external : require('./mount/external.js'),
		renderer : require('./mount/renderer.js'),
		statics : require('./mount/statics.js'),
		middleware : require('./mount/middleware.js'),
		routes : require('./mount/routes.js'),
		mongo : require('./mount/mongo.js'),
		handlers : require('./mount/handlers.js'),
	},
	_defaults = ['session','external','renderer','statics','middleware','routes','handlers','mongo'];

var dashes = '\n------------------------------------------------\n';

function mount(mountPath, parentApp, events) {
	
	// Validate the express app instance
	
	if (!this.app) {
		console.error('\nKeystoneJS Initialisaton Error:\n\napp must be initialised. Call keystone.init() or keystone.connect(new Express()) first.\n');
		process.exit(1);
	}
	
	// Localise references to this for closures
	
	var keystone = this,
		app = this.app;
	
	// this.nativeApp indicates keystone has been mounted natively
	// (not as part of a custom middleware stack)

	this.nativeApp = true;
	
	// Initialise the mongo connection url
	
	if (!this.get('mongo')) {
		var dbName = this.get('db name') || utils.slug(this.get('name'));
		var dbUrl = process.env.MONGO_URI || process.env.MONGO_URL || process.env.MONGOLAB_URI || process.env.MONGOLAB_URL || (process.env.OPENSHIFT_MONGODB_DB_URL || 'mongodb://localhost/') + dbName;
		this.set('mongo', dbUrl);
	}
	
	// wrangle arguments
	
	if (arguments.length === 1) {
		events = arguments[0];
		mountPath = null;
	}
	
	if ('function' === typeof events) {
		events = { onMount: events, duringMount: {} };
	}
	
	if (!events) events = {};
	
	if('object' !== typeof events.duringMount)events.duringMount = {};
	
	// prepare the final callback
	var finishMount = function() {
		
		//mongo finishes with a callback for us so help its helper
		if('object' === typeof customs.mongo && 'function' === typeof customs.mongo.afterDefault)
			customs.mongo.afterDefault(keystone)
				
		// Apply updates?
		if (keystone.get('auto update')) {
			var mounted = function () {
				events.onMount();
			}	
			keystone.applyUpdates(mounted);
		} else {
			events.onMount && events.onMount();
		}
	}
	
	// loop through the defaults and run any custom additions 
	
	var customs = events.duringMount;
	
	_defaults.forEach(function(module) {
		if(module === 'mongo') {
		
			// we run mongo last using its callback 
			
			if('object' === typeof customs.mongo && 'function' === typeof customs.mongo.beforeDefault)
				customs.mongo.beforeDefault(keystone)
			
			mountDefaults.mongo(keystone,finishMount);
		
		} else if('object' === typeof customs[module]) {
			
			//we could have custom functions so check each 
			
			if('function' === typeof customs[module].beforeDefault)
				customs[module].beforeDefault(keystone)
			
			if(customs[module].skipDefault === 'skip' && 'function' === typeof customs[module].customDefault) {	
				
				customs[module].customDefault(keystone)
						
			} else {
				
				mountDefaults[module](keystone,mountPath, parentApp)
				
			}
			
			if('function' === typeof customs[module].afterDefault)
				customs[module].afterDefault(keystone)
		
		} else {
			
			mountDefaults[module](keystone,mountPath, parentApp)
			
		}
	});
	
}

module.exports = mount;
