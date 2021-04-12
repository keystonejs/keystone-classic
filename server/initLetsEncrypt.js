/**
 * Configures Let's Encrypt if enabled.
 *
 * consumed by server/createApp.js
 *
 * @api private
 */

var letsencrypt = require('greenlock-express');

module.exports = function (keystone, app) {

	var options = keystone.get('letsencrypt');
	var ssl = keystone.get('ssl');
	if (!options) {
		return;
	}
	if (!ssl) {
		console.error('Ignoring `letsencrypt` setting because `ssl` is not set.');
	}
	if (ssl === 'only') {
		console.error('To use Let\'s Encrypt you need to have a regular HTTP listener as well. Please set ssl to either `true` or `"force"`.');
	}

	var version = options.version ? options.version : 'draft-12'
	var email = options.email;
	var approveDomains = options.domains;
	var server = options.production ? 'https://acme-v02.api.letsencrypt.org/directory' : 'https://acme-staging-v02.api.letsencrypt.org/directory';
	var agreeTos = options.tos;

	if (!Array.isArray(approveDomains)) {
		approveDomains = [approveDomains];
	}
	if (!(agreeTos && email && approveDomains)) {
		console.error("For auto registation with Let's Encrypt you have to agree to the TOS (https://letsencrypt.org/repository/) (tos: true), provide domains (domains: ['mydomain.com', 'www.mydomain.com']) and a domain owner email (email: 'admin@mydomain.com')");
		return;
	}
	// TODO maybe we should use le-store-mongo
	var lex = letsencrypt.create({
		version: version,
		server: server,
		approveDomains: approveDomains,
		agreeTos: agreeTos,
		email: email,
	});

	keystone.set('https server options', lex.httpsOptions);
	app.use(lex.middleware());
};
