module.exports = function initExpressApp (app) {
	if (this.app) return this;
	if (!app) app = require('express')();
	require('../../server/initLetsEncrypt')(this, app);
	require('../../server/initSslRedirect')(this, app);
	this.initDatabaseConfig();
	this.initExpressSession(this.mongoose);
	this.app = app;
	return this;
};
