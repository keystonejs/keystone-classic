var crypto = require('crypto');
var keystone = require('../');
var scmp = require('scmp');
var utils = require('keystone-utils');

/**
 * Creates a hash of str with Keystone's cookie secret.
 * Only hashes the first half of the string.
 */
function hash(str) {
	// force type
	str = '' + str;
	// get the first half
	str = str.substr(0, Math.round(str.length / 2));
	// hash using sha256
	return crypto
		.createHmac('sha256', keystone.get('cookie secret'))
		.update(str)
		.digest('base64')
		.replace(/\=+$/, '');
}

/**
 * Signs in a user using user obejct
 *
 * @param {Object} user - user object
 * @param {Object} req - express request object
 * @param {Object} res - express response object
 * @param {function()} onSuccess callback, is passed the User instance
 */

function signinWithUser(user, req, res, onSuccess) {
	if (arguments.length < 4) {
		throw new Error('keystone.session.signinWithUser requires user, req and res objects, and an onSuccess callback.');
	}
	if ('object' !== typeof user) {
		throw new Error('keystone.session.signinWithUser requires user to be an object.');
	}
	if ('object' !== typeof req) {
		throw new Error('keystone.session.signinWithUser requires req to be an object.');
	}
	if ('object' !== typeof res) {
		throw new Error('keystone.session.signinWithUser requires res to be an object.');
	}
	if ('function' !== typeof onSuccess) {
		throw new Error('keystone.session.signinWithUser requires onSuccess to be a function.');
	}
	req.session.regenerate(function() {
		req.user = user;
		req.session.userId = user.id;
		// if the user has a password set, store a persistence cookie to resume sessions
		if (keystone.get('cookie signin') && user.password) {
			var userToken = user.id + ':' + hash(user.password);
			res.cookie('keystone.uid', userToken, { signed: true, httpOnly: true });
		}
		onSuccess(user);
	});
}

exports.signinWithUser = signinWithUser;

var postHookedSigninWithUser = function(user, req, res, onSuccess, onFail) {
	keystone.callHook(user, 'post:signin', function(err) {
		if (err) {
			return onFail(err);
		}
		exports.signinWithUser(user, req, res, onSuccess, onFail);
	});
};

/**
 * Signs in a user user matching the lookup filters
 *
 * @param {Object} lookup - must contain email and password
 * @param {Object} req - express request object
 * @param {Object} res - express response object
 * @param {function()} onSuccess callback, is passed the User instance
 * @param {function()} onFail callback
 */

var doSignin = function(lookup, req, res, onSuccess, onFail) {
	if (!lookup) {
		return onFail(new Error('session.signin requires a User ID or Object as the first argument'));
	}
	var User = keystone.list(keystone.get('user model'));
	if ('string' === typeof lookup.email && 'string' === typeof lookup.password) {
		// ensure that it is an email, we don't want people being able to sign in by just using "\." and a haphazardly correct password.
		if (!utils.isEmail(lookup.email)) {
			return onFail(new Error('Incorrect email or password'));
		}
		// create regex for email lookup with special characters escaped
		var emailRegExp = new RegExp('^' + utils.escapeRegExp(lookup.email) + '$', 'i');
		// match email address and password
		User.model.findOne({ email: emailRegExp }).exec(function(err, user) {
			if (user) {
				user._.password.compare(lookup.password, function(err, isMatch) {
					if (!err && isMatch) {
						postHookedSigninWithUser(user, req, res, onSuccess, onFail);
					} else {
						onFail(err);
					}
				});
			} else {
				onFail(err);
			}
		});
	} else {
		lookup = '' + lookup;
		// match the userId, with optional password check
		var userId = (lookup.indexOf(':') > 0) ? lookup.substr(0, lookup.indexOf(':')) : lookup;
		var passwordCheck = (lookup.indexOf(':') > 0) ? lookup.substr(lookup.indexOf(':') + 1) : false;
		User.model.findById(userId).exec(function(err, user) {
			if (user && (!passwordCheck || scmp(passwordCheck, hash(user.password)))) {
				postHookedSigninWithUser(user, req, res, onSuccess, onFail);
			} else {
				onFail(err);
			}
		});
	}
};

exports.signin = function(lookup, req, res, onSuccess, onFail) {
	keystone.callHook({}, 'pre:signin', function(err) {
		if (err) {
			return onFail(err);
		}
		doSignin(lookup, req, res, onSuccess, onFail);
	});
};

/**
 * Signs the current user out and resets the session
 *
 * @param {Object} req - express request object
 * @param {Object} res - express response object
 * @param {function()} next callback
 */

exports.signout = function(req, res, next) {
	keystone.callHook(req.user, 'pre:signout', function(err) {
		if (err) {
			console.log("An error occurred in signout 'pre' middleware", err);
		}
		res.clearCookie('keystone.uid');
		req.user = null;
		req.session.regenerate(function(err) {
			if (err) {
				return next(err);
			}
			keystone.callHook({}, 'post:signout', function(err) {
				if (err) {
					console.log("An error occurred in signout 'post' middleware", err);
				}
				next();
			});
		});
	});
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
	if (!req.session) {
		console.error('\nKeystoneJS Runtime Error:\n\napp must have session middleware installed. Try adding "express-session" to your express instance.\n');
		process.exit(1);
	}
	if (keystone.get('cookie signin') && !req.session.userId && req.signedCookies['keystone.uid'] && req.signedCookies['keystone.uid'].indexOf(':') > 0) {
		exports.signin(req.signedCookies['keystone.uid'], req, res, function() {
			next();
		}, function(err) {
			next(err);
		});
	} else if (req.session.userId) {
		User.model.findById(req.session.userId).exec(function(err, user) {
			if (err) return next(err);
			req.user = user;
			next();
		});
	} else {
		next();
	}
};

/**
 * Middleware to enable access to Keystone
 *
 * Bounces the user to the signin screen if they are not signed in or do not have permission.
 *
 * req.user is the user returned by the database. It's type is Keystone.List.
 *
 * req.user.canAccessKeystone denotes whether the user has access to the admin panel.
 * If you're having issues double check your user model. Setting `canAccessKeystone` to true in
 * the database will not be reflected here if it is virtual.
 * See http://mongoosejs.com/docs/guide.html#virtuals
 *
 * @param {Object} req - express request object
 * @param req.user - The user object Keystone.List
 * @param req.user.canAccessKeystone {Boolean|Function}
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
