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
	var warningMsg = 'keystone.connect() is now deprecated and will not be available in future versions of KeystoneJS\n' +
		'It has been replaced with the Keystone "app" and "mongoose" options.\n' +
		'Due to changes in Express 4, "keystone.connect()" no longer works as expected.\n\n' +
		'See http://localhost:8080/docs/configuration#options-project for more information.';

	this.console.err('Deprecation Warning', warningMsg);

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
