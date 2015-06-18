/**
 * Adds shortcut methods for JSON API responses:
 * 
 *   * `res.apiResponse(data)`
 *   * `res.apiError(key, err, msg, code)`
 *   * `res.apiNotFound(err, msg)`
 *   * `res.apiNotAllowed(err, msg)`
 *
 * ####Example:
 *
 *     app.all('/api*', keystone.middleware.api);
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
		
		res.apiResponse = function(data) {
			if (req.query.callback) {
				res.jsonp(data);
			} else {
				res.json(data);
			}
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
			res.apiError('access not allowed', err, msg || 'not allowed', 403);
		};

		next();
	};
};
