var https = require('https');

module.exports = function (keystone, app, created, callback) {

	var ssl = keystone.get('ssl');
	var host = keystone.get('ssl host') || keystone.get('host');
	var port = keystone.get('ssl port') || 3001;
	var message = (ssl === 'only') ? keystone.get('name') + ' (SSL) is ready on ' : 'SSL Server is ready on ';

	var options = {};
	if (keystone.get('ssl cert') && fs.existsSync(keystone.getPath('ssl cert'))) {
		options.cert = fs.readFileSync(keystone.getPath('ssl cert'));
	}
	if (keystone.get('ssl key') && fs.existsSync(keystone.getPath('ssl key'))) {
		options.key = fs.readFileSync(keystone.getPath('ssl key'));
	}
	if (keystone.get('ssl ca') && fs.existsSync(keystone.getPath('ssl ca'))) {
		options.ca = fs.readFileSync(keystone.getPath('ssl ca'));
	}

	function ready (err) {
		callback(err, message);
	}

	if (!options.key || !options.cert) {
		if (ssl === 'only') {
			console.log(keystone.get('name') + ' failed to start: invalid ssl configuration (cert and ca files required)');
			process.exit();
		}
		return ready(null, 'Warning: Invalid SSL Configuration (cert and ca files required)');
	}

	var server = keystone.httpsServer = https.createServer(options, app);
	created();

	if (host) {
		message += 'https://' + host + ':' + port;
		server.listen(port, host, ready);
	} else {
		message += 'port ' + port;
		server.listen(port, ready);
	}
	
};
