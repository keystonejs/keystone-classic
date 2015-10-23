var assign = require('object-assign');

module.exports = function initTrustProxy (keystone, app) {
	// Apply locals
	if (typeof keystone.get('locals') === 'object') {
		assign(app.locals, keystone.get('locals'));
	}

	// Default "pretty html" mode except in production
	if (keystone.get('env') !== 'production') {
		app.locals.pretty = true;
	}
};
