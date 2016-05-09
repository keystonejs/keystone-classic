var debug = require('debug')('keystone:server:bindIpRestrictions');

module.exports = function bindIPRestrictions (keystone, app) {
	// Check for IP range restrictions
	if (keystone.get('allowed ip ranges')) {
		if (!app.get('trust proxy')) {
			console.log(
				'KeystoneJS Initialisaton Error:\n\n'
				+ 'to set IP range restrictions the "trust proxy" setting must be enabled.\n\n'
			);
			process.exit(1);
		}
		debug('adding IP ranges', keystone.get('allowed ip ranges'));
		app.use(require('../lib/security/ipRangeRestrict')(
			keystone.get('allowed ip ranges'),
			keystone.wrapHTMLError
		));
	}
};
