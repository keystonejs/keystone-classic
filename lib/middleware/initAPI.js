/**
 * Middleware to initialise a standard API response.
 *
 * Adds `res.apiResonse` and `res.apiError` methods.
 *
 * ####Example:
 *
 *     app.all('/api*', initAPI);
 *
 * @param {app.request} req
 * @param {app.response} res
 * @param {function} next
 * @api public
 */

// The exported function returns a closure that retains
// a reference to the keystone instance, so it can be
// passed as middeware to the express app.

exports = module.exports = function(keystone) {
	return function initAPI(req, res, next) {
		
		var origin = keystone.get('api allow origin');
		if (origin) {
			res.header('Access-Control-Allow-Origin', origin === true ? '*' : origin);
		};
		
		if (keystone.get('api allow methods') !== false) {
			res.header('Access-Control-Allow-Methods', keystone.get('api allow methods') || 'GET,PUT,POST,DELETE');
		}
		if (keystone.get('api allow headers') !== false) {
			res.header('Access-Control-Allow-Headers', keystone.get('api allow headers') || 'Content-Type, Authorization');
		}
		
		res.apiResponse = function(status) {
			if (req.query.callback)
				res.jsonp(status);
			else
				res.json(status);
		};

		res.apiError = function(key, err, msg, code) {
			msg = msg || 'Error';
			key = key || 'unknown error';
			msg += ' (' + key + ')';
			if (keystone.get('logger')) {
				console.log(msg + (err ? ':' : ''));
				if (err) {
					console.log(err);
				}
			}
			res.status(code || 500);
			res.apiResponse({ error: key || 'error', detail: err });
		};
		
		res.apiNotFound = function (err, msg) {
			res.apiError('data not found', err, msg || 'not found', 404);
		};
		
		res.apiNotAllowed = function (err, msg) {
			res.apiError('access allowed', err, msg || 'not allowed', 403);
		};

		next();
	};
};
