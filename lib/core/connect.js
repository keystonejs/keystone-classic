/**
 * Connects keystone to the application's mongoose instance.
 *
 * ####Example:
 *
 *     var mongoose = require('mongoose');
 *
 *     keystone.connect(mongoose);
 *
 * @param {Object} connections
 * @api public
 */

var debug = require('debug')('keystone:core:connect');

function connect() {
	// detect type of each argument
	for (var i = 0; i < arguments.length; i++) {
		if (arguments[i].constructor.name === 'Mongoose') {
			debug('detected mongoose');
			this.mongoose = arguments[i];
		} else if (arguments[i].name === 'app') {
			debug('detected express app');
			this.app = arguments[i];
		}
	}
	return this;
}

module.exports = connect;
