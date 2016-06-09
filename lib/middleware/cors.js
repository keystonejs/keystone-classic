/**
 * Adds CORS headers to the response
 *
 * ####Example:
 *
 *     app.all('/api*', keystone.middleware.cors);
 *
 * @param {app.request} req
 * @param {app.response} res
 * @param {function} next
 * @api public
 */

// The exported function returns a closure that retains
// a reference to the keystone instance, so it can be
// passed as middeware to the express app.

module.exports = function (keystone) {
	return function cors (req, res, next) {

		var origin = keystone.get('cors allow origin');
		if (origin) {
			res.header('Access-Control-Allow-Origin', origin === true ? '*' : origin);
		}

		if (keystone.get('cors allow methods') !== false) {
			res.header('Access-Control-Allow-Methods', keystone.get('cors allow methods') || 'GET,PUT,POST,DELETE,OPTIONS');
		}
		if (keystone.get('cors allow headers') !== false) {
			res.header('Access-Control-Allow-Headers', keystone.get('cors allow headers') || 'Content-Type, Authorization');
		}

		next();
	};
};
