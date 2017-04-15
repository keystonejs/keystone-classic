module.exports = function initExpressApp (customApp) {
	this.initDatabaseConfig();
	this.initExpressSession(this.mongoose);
	this.app = require('../../server/createApp')(this, customApp);
	return this;
};
