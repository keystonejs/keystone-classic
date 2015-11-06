module.exports = function initExpressApp () {
	if (this.app) return this;
	this.initDatabase();
	this.initExpressSession();
	this.app = require('../../server/createApp')(this);
	return this;
};
