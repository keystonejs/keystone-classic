var http = require('http'),
	_ = require('underscore'),
	express = require('express'),
	jade = require('jade'),
	content = require('./content/site.json');

function view(view, options) {
	return function(req, res, next) {
		res.render(view, options);
	}
}

// Initialise app

var app = express();

app.set('port', 8080);
app.set('views', 'content/templates/views');
app.set('view engine', 'jade');

app.use(express.favicon('public/favicon.ico'));
app.use(require('less-middleware')({ src: 'public' }));
app.use(express.static('public'));

app.use(express.logger('dev'));

// Set up locals and routes

_.extend(app.locals, content.locals);

app.locals.version = require('../package.json').version;

_.each(content.routes, function(options) {
	app.get(options.path, view(options.template, options));
});

app.use(function(req, res, next) {
	res.status(404).send("Sorry, no page could be found at this address (404)");
});

app.use(express.errorHandler());

// Start server

http.createServer(app).listen(app.get('port'), function() {
	console.log('Keystone docs are available on port ' + app.get('port'));
});
