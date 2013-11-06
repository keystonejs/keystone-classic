var keystone = require('../'),
	utils = require('keystone-utils');


/**
 * Signs in a user user matching the lookup filters
 * 
 * @param {Object} lookup - must contain email and password
 * @param {Object} req - express request object
 * @param {Object} res - express response object
 * @param {function()} onSuccess callback, is passed the User instance
 * @param {function()} onFail callback
 */

var signin = exports.signin = function(lookup, req, res, onSuccess, onFail) {
	
	var User = keystone.list(keystone.get('user model'));
	
	var doSignin = function(user) {
		req.session.regenerate(function() {
			
			req.user = user;
			req.session.userId = user.id;
			res.cookie('userId', user.id);
			
			onSuccess(user);
			
		});
	}
	
	if (utils.isObject(lookup)) {
		// match email address and password
		User.model.findOne({ email: lookup.email }).exec(function(err, user) {
			if (user) {
				user._.password.compare(lookup.password, function(err, isMatch) {
					if (!err && isMatch) {
						doSignin(user);
					}
					else {
						onFail(err);
					}
				});
			} else {
				onFail(err);
			}
		});
	} else {
		// or just find the user
		User.model.findById(lookup).exec(function(err, user) {
			if (user) {
				doSignin(user);
			} else {
				onFail(err);
			}
		});
	}

}


/**
 * Signs the current user out and resets the session
 * 
 * @param {Object} req - express request object
 * @param {Object} res - express response object
 * @param {function()} next callback
 */

var signout = exports.signout = function(req, res, next) {
	
	res.clearCookie('userId');
	req.user = null;
	
	req.session.regenerate(function() {
		next();
	});
	
}


/**
 * Middleware to ensure session persistence across server restarts
 * 
 * Looks for a userId cookie, and if present, and there is no user signed in,
 * automatically signs the user in.
 * 
 * @param {Object} req - express request object
 * @param {Object} res - express response object
 * @param {function()} next callback
 */

exports.persist = function(req, res, next) {
	
	var User = keystone.list(keystone.get('user model'));
	
	if (!req.session.userId && req.cookies.userId) {
		
		var _next = function() { next(); }; // otherwise the matching user is passed to next() which messes with the middleware signature
		signin(req.cookies.userId, req, res, _next, _next);
		
	} else if (req.session.userId) {
		
		User.model.findById(req.session.userId).exec(function(err, user) {
			
			if (err)
				return next(err);
			
			req.user = user;
			next();
			
		});
		
	}
	else {
		next();
	}
	
}


/**
 * Middleware to enable access to Keystone
 * 
 * Bounces the user to the signin screen if they are not signed in or do not have permission.
 * 
 * @param {Object} req - express request object
 * @param {Object} res - express response object
 * @param {function()} next callback
 */

exports.keystoneAuth = function(req, res, next) {
	
	if (!req.user || !req.user.canAccessKeystone)
		return res.redirect('/keystone/signin');
	next();
	
}
