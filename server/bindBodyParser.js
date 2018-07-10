var bodyParser = require('body-parser');

var uploads = require('../lib/uploads');

module.exports = function bindBodyParser (keystone, app) {
	// Set up body options and cookie parser
	var bodyParserParams = {};
	if (keystone.get('file limit')) {
		bodyParserParams.limit = keystone.get('file limit');
	}
	app.use(bodyParser.json(bodyParserParams));
	bodyParserParams.extended = true;
	app.use(bodyParser.urlencoded(bodyParserParams));
	if (keystone.get('handle uploads')) {
		uploads.configure(app, keystone.get('multer options'));
	}
};
