var express = require('express');

function mountMiddleware(keystone) {
	
	// Handle dynamic requests
	
	var app = keystone.app;
	
	if (keystone.get('logger')) {
		app.use(express.logger(keystone.get('logger')));
	}
	
	if (keystone.get('file limit')) {
		app.use(express.limit(keystone.get('file limit')));
	}
	
	var sessionOptions = keystone.set('session options');
	
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(sessionOptions.cookieParser);
	app.use(express.session(sessionOptions));
	app.use(require('connect-flash')());
	
	if (keystone.get('session') === true) {
		app.use(keystone.session.persist);
	} else if ('function' === typeof keystone.get('session')) {
		app.use(keystone.get('session'));
	}
	
	// Process 'X-Forwarded-For' request header
	
	if (keystone.get('trust proxy') === true) {
		app.enable('trust proxy');
	} else {
		app.disable('trust proxy');
	}
	
	// Check for IP range restrictions
	
	if (keystone.get('allowed ip ranges')) {
		if (!app.get('trust proxy')) {
			console.log(
				'KeystoneJS Initialisaton Error:\n\n' +
				'to set IP range restrictions the "trust proxy" setting must be enabled.\n\n'
			);
			process.exit(1);
		}
		var ipRangeMiddleware = require('./lib/security/ipRangeRestrict')(
			keystone.get('allowed ip ranges'),
			keystone.wrapHTMLError
		);
		keystone.pre('routes', ipRangeMiddleware);
	}
	
	// Pre-route middleware
	
	keystone._pre.routes.forEach(function(fn) {
		try {
			app.use(fn);
		}
		catch(e) {
			if (keystone.get('logger')) {
				console.log('Invalid pre-route middleware provided');
			}
			throw e;
		}
	});
}

module.exports = mountMiddleware;
