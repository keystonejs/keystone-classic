var keystone = require('../../index.js'),
	mongoose = require('./getMongooseConnection.js');

function getExpressApp() {
	var app;

	keystone.init();
	keystone.connect(mongoose);
	app = keystone.express();

	app.use(keystone.express.bodyParser());
	app.use(keystone.express.methodOverride());

	return app;
}

module.exports = getExpressApp;