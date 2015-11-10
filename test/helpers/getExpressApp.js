var keystone = require('../../index.js');
var mongoose = require('./getMongooseConnection.js');
var methodOverride = require('method-override');
var bodyParser = require('body-parser');

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
