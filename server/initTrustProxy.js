module.exports = function initTrustProxy (keystone) {
	// Process 'X-Forwarded-For' request header
	if (keystone.get('trust proxy') === true) {
		keystone.app.enable('trust proxy');
	} else {
		keystone.app.disable('trust proxy');
	}
};
