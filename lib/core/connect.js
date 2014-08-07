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

function connect() {
	// detect type of each argument
	for (var i = 0; i < arguments.length; i++) {
		if (arguments[i].constructor.name === 'Mongoose') {
			// detected Mongoose
			this.mongoose = arguments[i];
		} else if (arguments[i].name === 'app') {
			// detected Express app
			this.app = arguments[i];
		}
	}
	return this;
}

module.exports = connect;
