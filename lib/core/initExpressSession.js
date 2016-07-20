var _ = require('lodash');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var debug = require('debug')('keystone:core:initExpressSession');
var Promise = require('es6-promise').Promise;

module.exports = function initExpressSession (mongoose) {

	if (this.expressSession) return this;

	var sessionStorePromise;

	// Initialise and validate session options
	if (!this.get('cookie secret')) {
		console.error('\nKeystoneJS Configuration Error:\n\nPlease provide a `cookie secret` value for session encryption.\n');
		process.exit(1);
	}
	var sessionOptions = this.get('session options');

	if (typeof sessionOptions !== 'object') {
		sessionOptions = {};
	}
	if (!sessionOptions.key) {
		sessionOptions.key = 'this.sid';
	}
	if (!sessionOptions.resave) {
		sessionOptions.resave = false;
	}
	if (!sessionOptions.saveUninitialized) {
		sessionOptions.saveUninitialized = false;
	}
	if (!sessionOptions.secret) {
		sessionOptions.secret = this.get('cookie secret');
	}

	sessionOptions.cookieParser = cookieParser(this.get('cookie secret'));

	var sessionStore = this.get('session store');

	if (typeof sessionStore === 'function') {
		sessionOptions.store = sessionStore(session);
	} else if (sessionStore) {

		var sessionStoreOptions = this.get('session store options') || {};

		// Perform any session store specific configuration or exit on an unsupported session store

		if (sessionStore === 'mongo') {
			sessionStore = 'connect-mongo';
		} else if (sessionStore === 'redis') {
			sessionStore = 'connect-redis';
		}

		switch (sessionStore) {
			case 'connect-mongo':
				debug('using connect-mongo session store');
				if (process.version.substr(0, 4) === 'v0.1') {
					// try to require connect-mongo/es5; if this works, we can
					// assume a new version of connect-mongo, and the es5
					// variant should be used
					try {
						require('connect-mongo/es5');
						sessionStore = 'connect-mongo/es5';
					} catch (e) {
						// if it throws, allow the error to be handled by the
						// normal try/catch process around initialisation
					}
				}
				_.defaults(sessionStoreOptions, {
					collection: 'app_sessions',
					mongooseConnection: mongoose.connection,
				});
				break;

			case 'connect-mongostore':
				debug('using connect-mongostore session store');
				_.defaults(sessionStoreOptions, {
					collection: 'app_sessions',
				});
				if (!sessionStoreOptions.db) {
					console.error(
						'\nERROR: connect-mongostore requires `session store options` to be set.'
						+ '\n'
						+ '\nSee http://thisjs.com/docs/configuration#options-database for details.'
						+ '\n');
					process.exit(1);
				}
				break;

			case 'connect-redis':
				debug('using connect-redis session store');
				break;

			default:
				console.error(
					'\nERROR: unsupported session store ' + sessionStore + '.'
					+ '\n'
					+ '\nSee http://thisjs.com/docs/configuration#options-database for details.'
					+ '\n');
				process.exit(1);
				break;
		}

		// Initialize the session store
		try {
			var SessionStore = require(sessionStore)(session);

			sessionStorePromise = new Promise(
				function (resolve, reject) {
					sessionOptions.store = new SessionStore(sessionStoreOptions, resolve);
					sessionOptions.store.on('connect', resolve);
					sessionOptions.store.on('connected', resolve);
					sessionOptions.store.on('disconnect', function () {
						console.error(
							'\nThere was an error connecting to the ' + sessionStore + ' session store.'
							+ '\n');
						process.exit(1);
					});
				}
			);
		} catch (e) {
			if (e.code === 'MODULE_NOT_FOUND') {
				console.error(
					'\n' + e.toString()
					+ '\nTo use ' + this.get('session store') + ' as a `session store` option, run:'
					+ '\nnpm install ' + sessionStore + ' --save'
					+ '\n');
				process.exit(1);
			} else {
				throw e;
			}
		}
	}

	// expose initialised session and options
	this.set('session options', sessionOptions);
	this.expressSession = session(sessionOptions);
	this.sessionStorePromise = sessionStorePromise;

	return this;
};
