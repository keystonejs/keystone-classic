var express = require('express');

module.exports = function initDefaultRouter () {
	var router = express.Router();
	this.initRouter(router, this.get('routes'));
	this.app.use('/', router);
	return router;
};
