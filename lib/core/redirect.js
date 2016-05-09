var _ = require('lodash');
var utils = require('keystone-utils');

/**
 * Adds one or more redirections (urls that are redirected when no matching
 * routes are found, before treating the request as a 404)
 *
 * #### Example:
 * 		keystone.redirect('/old-route', 'new-route');
 *
 * 		// or
 *
 * 		keystone.redirect({
 * 			'old-route': 'new-route'
 * 		});
 */

function redirect () {
	if (arguments.length === 1 && utils.isObject(arguments[0])) {
		_.extend(this._redirects, arguments[0]);
	} else if (arguments.length === 2 && typeof arguments[0] === 'string' && typeof arguments[1] === 'string') {
		this._redirects[arguments[0]] = arguments[1];
	}
	return this;
}

module.exports = redirect;
