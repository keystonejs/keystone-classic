/**
 * Configures and starts express server.
 *
 * Events are fired during initialisation to allow customisation, including:
 *   - onHttpServerCreated
 *
 * consumed by lib/core/start.js
 *
 * @api private
 */
 
module.exports = function (keystone, app, callback) {

	var host = keystone.get('host');
	var port = keystone.get('port') || 3000;
	var message = keystone.get('name') + ' is ready on ';

	function ready (err) {
		callback(err, message);
	}

	if (host) {
		message += 'http://' + host + ':' + port;
		keystone.httpServer = app.listen(port, host, ready);
	} else {
		message += 'port ' + port;
		keystone.httpServer = app.listen(port || 3000, ready);
	}

};
