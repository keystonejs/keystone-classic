var keystone = require('../../index.js'),
	mongoose = require('./getMongooseConnection.js'),
	methodOverride = require('method-override'),
	bodyParser = require('body-parser');

function getExpressApp() {
	var app;

	keystone.init({
		'mongoose': mongoose
	});
	app = keystone.express();

	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({
		extended: true
	}));
	app.use(methodOverride());

	return app;
}

module.exports = getExpressApp;
