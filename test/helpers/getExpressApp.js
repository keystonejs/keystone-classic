var keystone = require('../../index.js'),
	mongoose = require('./getMongooseConnection.js'),
	methodOverride = require('method-override'),
	bodyParser = require('body-parser');

function getExpressApp() {
	var app;

	keystone.init();
	keystone.connect(mongoose);
	app = keystone.express();

	app.use(bodyParser());
	app.use(methodOverride());

	return app;
}

module.exports = getExpressApp;
