/**
 * Configures a Keystone app in encapsulated mode, but does not start it.
 * Connects to the database and runs updates and then calls back.
 *
 * Events are fired during initialisation to allow customisation, including:
 *   - onMount
 *
 * If the events argument is a function, it is assumed to be the mounted event.
 */

function mount(callback) {
	this.initDatabase();
	this.initExpressSession();
	this.app = require('../../server/createApp')(this);
	// Open database connection
	this.openDatabaseConnection(callback);
}

module.exports = mount;
