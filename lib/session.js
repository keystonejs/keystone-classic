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
			
			// secure the user ID cookie with half the password hash, so if the password changes
			// the cookie will no longer be valid
			
			var userToken = user.id + ':' + user.password.substr(0, Math.round(user.password.length / 2));
			res.cookie('keystone.uid', userToken, { signed: true, httpOnly: true });
			
			onSuccess(user);
			
		});
	};
	
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
		
		// match the userId, with optional password check
		var userId = (lookup.indexOf(':') > 0) ? lookup.substr(0, lookup.indexOf(':')) : lookup,
			passwordCheck = lookup.substr(lookup.indexOf(':') + 1);
		
		User.model.findById(userId).exec(function(err, user) {
			if (user && (!passwordCheck || passwordCheck === user.password.substr(0, passwordCheck.length))) {
				doSignin(user);
			} else {
				onFail(err);
			}
		});
	}

};


/**
 * Signs the current user out and resets the session
 *
 * @param {Object} req - express request object
 * @param {Object} res - express response object
 * @param {function()} next callback
 */

var signout = exports.signout = function(req, res, next) {

	res.clearCookie('keystone.uid');
	req.user = null;

	req.session.regenerate(next);

};


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

	if (!req.session.userId && req.signedCookies['keystone.uid'] && req.signedCookies['keystone.uid'].indexOf(':') > 0) {
		
		var _next = function() { next(); }; // otherwise the matching user is passed to next() which messes with the middleware signature
		signin(req.signedCookies['keystone.uid'], req, res, _next, _next);

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

};


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

	if (!req.user || !req.user.canAccessKeystone) {
		var from = new RegExp('^\/keystone\/?$', 'i').test(req.url) ? '' : '?from=' + req.url;
		return res.redirect(keystone.get('signin url') + from);
	}

	next();

};
