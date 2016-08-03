var express = require('express');

module.exports = function initExpressApp (customApp) {
	if (this.app) return this;
	this.initDatabase();
	this.initExpressSession(this.mongoose);
	if (customApp) {
		this.app = customApp;
	} else {
		this.app = express();
	}

	require('../../server/initTrustProxy')(this);
	require('../../server/initViewEngine')(this);
	require('../../server/initViewLocals')(this);

	return this;
};
