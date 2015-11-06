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

module.exports = function(keystone, app, callback) {

	var unixSocket = keystone.get('unix socket');
	var message = keystone.get('name') + ' is ready on ' + unixSocket;

	function ready (err) {
		callback(err, message);
	}

	fs.unlink(unixSocket, function(err) {
		// we expect err if the file is new so continue either way
		keystone.httpServer = app.listen(unixSocket, ready);
		fs.chmod(unixSocket, 0x777);
	});
	
};
