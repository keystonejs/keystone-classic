var fs = require('fs');

module.exports = function(keystone, app, callback) {

	var unixSocket = keystone.get('unix socket');
	var message = keystone.get('name') + ' is ready on ' + unixSocket;

	function ready (err) {
		callback(err, message);
	}

	fs.unlink(unixSocket, function(err) {
		if (err) return callback(err);
		keystone.httpServer = app.listen(unixSocket, ready);
		fs.chmod(unixSocket, 0x777);
	});
}
