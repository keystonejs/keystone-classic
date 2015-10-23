module.exports = function initTrustProxy (keystone, app) {
	// Process 'X-Forwarded-For' request header
	if (keystone.get('trust proxy') === true) {
		app.enable('trust proxy');
	} else {
		app.disable('trust proxy');
	}
};
