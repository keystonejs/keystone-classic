/**
 * Configures and starts express server.
 *
 * Events are fired during initialisation to allow customisation, including:
 *   - onSocketServerCreated
 *
 * consumed by lib/core/start.js
 *
 * @api private
 */

var fs = require('fs');

module.exports = function (keystone, app, callback) {

	var unixSocket = keystone.get('unix socket');
	var message = keystone.get('name') + ' is ready on ' + unixSocket;

	fs.unlink(unixSocket, function () {
		// we expect err if the file is new so don't capture the argument
		keystone.httpServer = app.listen(unixSocket, function (err) {
			callback(err, message);
		});
		fs.chmod(unixSocket, 0x777);
	});

};
