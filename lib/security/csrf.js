var crypto = require('crypto'),
	utils = require('keystone-utils');

exports.TOKEN_KEY = '_csrf';
exports.LOCAL_KEY = 'csrf_token_key';
exports.LOCAL_VALUE = 'csrf_token_value';
exports.SECRET_KEY = exports.TOKEN_KEY + '_secret';
exports.SECRET_LENGTH = 10;

function tokenize(salt, secret) {
	return salt + crypto.createHash('sha1').update(salt + secret).digest('base64');
}

exports.createSecret = function() {
	return crypto.pseudoRandomBytes(exports.SECRET_LENGTH).toString('base64');
};

exports.getSecret = function(req) {
	return req.session[exports.SECRET_KEY] || (req.session[exports.SECRET_KEY] = exports.createSecret());
};

exports.createToken = function(req) {
	return tokenize(utils.randomString(exports.SECRET_LENGTH), exports.getSecret(req));
};

exports.getToken = function(req, res) {
	return res.locals[exports.LOCAL_VALUE] || (res.locals[exports.LOCAL_VALUE] = exports.createToken(req));
};

exports.requestToken = function(req) {
	if (req.body && req.body[exports.TOKEN_KEY]) {
		return req.body[exports.TOKEN_KEY];
	} else if (req.query && req.query[exports.TOKEN_KEY]) {
		return req.query[exports.TOKEN_KEY];
	}
	return '';
};

exports.validate = function(req, token) {
	if (arguments.length === 1) {
		token = exports.requestToken(req);
	}
	if (typeof token !== 'string') {
		return false;
	}
	return token === tokenize(token.slice(0, exports.SECRET_LENGTH), req.session[exports.SECRET_KEY]);
};

exports.middleware = {
	
	init: function(req, res, next) {
		res.locals[exports.LOCAL_KEY] = exports.LOCAL_VALUE;
		exports.getToken(req, res);
		next();
	},
	
	validate: function(req, res, next) {
		
		// Bail on safe methods
		if (req.method === 'GET' || req.method === 'HEAD' || req.method === 'OPTIONS') {
			return next();
		}
		
		// Validate token
		if (exports.validate(req)) {
			next();
		} else {
			res.statusCode = 403;
			next(new Error('CSRF token mismatch'));
		}
	
	}
	
};
