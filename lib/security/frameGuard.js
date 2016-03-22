/**
 * Adds iframe protection headers to the response
 *
 * ####Example:
 *
 *     app.use(keystone.security.frameGuard(keystone));
 *
 * @param {app.request} req
 * @param {app.response} res
 * @param {function} next
 * @api public
 */

module.exports = function (keystone) {
	return function frameGuard (req, res, next) {
		var options = keystone.get('frame guard');
		if (options) {
			res.header('x-frame-options', options);
		}
		next();
	};
};
