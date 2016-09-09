module.exports = function initExpressApp (customApp) {
	if (this.app) return this;
	this.initDatabaseConfig();
	this.initExpressSession(this.mongoose);
	if (customApp) {
		this.app = customApp;
		require('../../server/createApp')(this);
	} else {
		this.app = require('../../server/createApp')(this);
	}
	return this;
};
