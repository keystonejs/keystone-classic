process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var express = require('express'),
	http = require('http'),
	path = require('path'),
	flash = require('connect-flash'),
	mongoose = require('mongoose'),
	keystone = require('keystone').connect(mongoose);

require('./models');

var session = require('./lib/session');

keystone.set('auth', session.keystoneAuth);
keystone.set('brand', 'Team 9');

// Initialise Express Application
var app = express();

app.configure(function() {
	
	// Setup
	app.set('port', process.env.PORT || 3000);
	app.set('views', __dirname + '/views');
	app.set('view engine', 'jade');
	
	// Serve static assets
	app.use(express.compress());
	app.use(express.favicon(__dirname + '/public/favicon.ico'));
	app.use(require('less-middleware')({ src: __dirname + '/public' }));
	app.use(express.static(path.join(__dirname, 'public')));
	keystone.static(app);
	
	// Handle dynamic requests
	app.use(express.logger('dev'));
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(express.cookieParser('-- your secret here --'));
	app.use(express.session());
	app.use(flash());
	app.use(session.persist);
	
	// Route requests
	app.use(app.router);

	// Handle 404s
	app.use(function(req, res, next) {
		res.status(404).send("Sorry, no page could be found at this address.");
	});

});

// Use Express error handler in the development environment
app.configure('development', function() {
	app.use(express.errorHandler());
});

// Configure keystone routes
keystone.routes(app);

// Configure application routes
require('./routes')(app);

// Connect to the database and start the webserver
mongoose.connect('localhost', '-- your database --');

mongoose.connection.on('error', function() {
	console.error('Website failed to launch: mongo connection error', arguments);
}).on('open', function() {
	http.createServer(app).listen(app.get('port'), function() {
		console.log("Website is ready on port " + app.get('port'));
	});
});
