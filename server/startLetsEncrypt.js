/**
 * Configures and starts express server via Let's Encrypt.
 *
 * Events are fired during initialisation to allow customisation, including:
 *   - onHttpServerCreated
 *
 * consumed by lib/core/start.js
 *
 * @api private
 */

var async = require('async');
var http = require('http');
var https;
try {
	// Use spdy if available
	https = require('spdy');
} catch (e) {
	https = require('https');
}
var path = require('path');
var letsencrypt = require('letsencrypt-express');
var letsencryptDir = path.join(require('os').homedir(), 'letsencrypt', 'etc');

function makeSslRedirect (app) {
	return function sslRedirect (req, res) {
		// This runs outside Express, so use pure NodeJS only
		const s = req.socket;
		if (s && s.remoteAddress === '127.0.0.1' && s.localAddress === '127.0.0.1' && !req.headers['x-forwarded-for']) {
			return app(req, res);
		} else {
			res.setHeader('Location', 'https://' + req.headers.host + req.url);
			res.statusCode = 302;
			res.end();
		}
	};
}

function autoRegister (domains, email) {
	if (!Array.isArray(domains)) {
		domains = [domains];
	}
	return function (hostname, approve) {
		if (domains.indexOf(hostname) !== -1) {
			console.warn("Keystone Let's Encrypt: Approving registration for " + hostname);
			approve(null, {
				domains: domains,
				email: email,
				agreeTos: true,
			});
		} else {
			console.log("Keystone Let's Encrypt: Denying registration for " + hostname);
			approve('Nope.');
		}
	};
}
module.exports = function (keystone, app, callback) {

	var name = keystone.get('name');
	var host = keystone.get('host') || '0.0.0.0';
	var port = keystone.get('port') || 3000;
	var forceSsl = (keystone.get('ssl') === 'force');
	var sslHost = keystone.get('ssl host') || host;
	var sslPort = keystone.get('ssl port') || port + 1;

	var options = keystone.get('letsencrypt');
	var email = options.email;
	var domains = options.domains;
	var approveRegistration;
	if (options.register) {
		if (options.tos && email && domains) {
			approveRegistration = autoRegister(domains, email);
		} else {
			callback("For auto registation with Let's Encrypt you should agree to the TOS, provide domains and a domain owner email");
			return;
		}
	}
	var instance = letsencrypt.create({
		configDir: options.configDir || letsencryptDir,
		onRequest: app,
		approveRegistration: approveRegistration,
		// TODO handleRenewFailure
	});

	async.parallel([
		function (done) {
			var serve = (forceSsl) ? makeSslRedirect(app) : app;
			keystone.httpServer = http.createServer(
				letsencrypt.createAcmeResponder(instance, serve)
			).listen(port, host, done);
		},
		function (done) {
			keystone.httpsServer = https.createServer(
				instance.httpsOptions,
				letsencrypt.createAcmeResponder(instance, app)
			).listen(sslPort, sslHost, done);
		},
	], 	function ready (err) {
		if (err) { return callback(err); }

		var message = name + ' is ready on '
		+ 'http://' + host + ':' + port
		+ (forceSsl ? ' (SSL redirect)' : '')
		+ ' and ' + 'https://' + sslHost + ':' + sslPort;
		callback(null, message);
	});

};
