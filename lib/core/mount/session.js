var _ = require('underscore'),
	express = require('express');

function mountSession(keystone) {
	
	var app = keystone.app;
		
	// Initialise and validate session options
	
	if (!keystone.get('cookie secret')) {
		console.error('\nKeystoneJS Configuration Error:\n\nPlease provide a `cookie secret` value for session encryption.\n');
		process.exit(1);
	}
	
	var sessionOptions = keystone.get('session options');
	
	if (!_.isObject(sessionOptions)) {
		sessionOptions = {};
	}
	
	if (!sessionOptions.key) {
		sessionOptions.key = 'keystone.sid';
	}
	
	sessionOptions.cookieParser = express.cookieParser(keystone.get('cookie secret'));

	var sessionStore = keystone.get('session store');

	if (sessionStore) {
		
		var sessionStoreOptions = keystone.get('session store options') || {};

		// Perform any session store specific configuration or exit on an unsupported session store
		
		switch (sessionStore) {
			
			case 'mongo':
				// default session store for using MongoDB
				sessionStore = 'connect-mongo';
			case 'connect-mongo':
				_.defaults(sessionStoreOptions, {
					collection: 'app_sessions',
					url: keystone.get('mongo')
				});
				break;

			case 'connect-mongostore':
				_.defaults(sessionStoreOptions, {
					collection: 'app_sessions'
				});
				if (!sessionStoreOptions.db) {
					console.error(
						'\nERROR: ' + sessionStore + ' requires `session store options` to be set.' +
						'\n' +
						'\nSee http://localhost:8080/docs/configuration#options-database for details.' +
					'\n');
					process.exit(1);
				}
				break;
			
			case 'redis':
				// default session store for using Redis
				sessionStore = 'connect-redis';
			case 'connect-redis':
				break;

			default:
				console.error(
						'\nERROR: unsupported session store ' + sessionStore + '.' +
						'\n' +
						'\nSee http://localhost:8080/docs/configuration#options-database for details.' +
					'\n');
				process.exit(1);
				break;
		}

		// Initialize the session store
		try {
			
			var _SessionStore = require(sessionStore)(express);
			sessionOptions.store = new _SessionStore(sessionStoreOptions);
			
		} catch(e) {
			
			if (e.code === 'MODULE_NOT_FOUND') {
				
				// connect-redis must be explicitly installed @1.4.7, so we special-case it here
				var installName = (sessionStore === 'connect-redis') ? sessionStore + '@1.4.7' : sessionStore;
				
				console.error(
					'\nERROR: ' + sessionStore + ' not found.\n' +
					'\nPlease install ' + sessionStore + ' from npm to use it as a `session store` option.' +
					'\nYou can do this by running "npm install ' + installName + ' --save".' +
				'\n');
				process.exit(1);
				
			} else {
				throw e;
			}
		}
	}

	// expose initialised session options
	
	keystone.set('session options', sessionOptions);
	
}

module.exports = mountSession;
