var assign = require('object-assign');

module.exports = function initViewLocals (keystone) {
	// Apply locals
	if (typeof keystone.get('locals') === 'object') {
		assign(keystone.app.locals, keystone.get('locals'));
	}

	// Default "pretty html" mode except in production
	// Only if it has not been specified in the locals setting
	if (keystone.app.locals.pretty === undefined && keystone.get('env') !== 'production') {
		keystone.app.locals.pretty = true;
	}
};
