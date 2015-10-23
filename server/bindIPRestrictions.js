module.exports = function bindIPRestrictions (keystone, app) {
	// Check for IP range restrictions
	if (this.get('allowed ip ranges')) {
		if (!app.get('trust proxy')) {
			console.log(
				'KeystoneJS Initialisaton Error:\n\n' +
				'to set IP range restrictions the "trust proxy" setting must be enabled.\n\n'
			);
			process.exit(1);
		}
		debug('adding IP ranges', this.get('allowed ip ranges'));
		app.use(require('../security/ipRangeRestrict')(
			this.get('allowed ip ranges'),
			this.wrapHTMLError
		));
	}
};
