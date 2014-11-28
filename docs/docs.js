var http = require('http'),
	_ = require('underscore'),
	express = require('express'),
	jade = require('jade'),
	content = require('./content/site.json');

function view(view, options) {
	return function(req, res, next) {
		options.pretty = true;
		console.log(req.session.currentLanguage);
		var docsBase = __dirname + '/content/pages/';
		if(req.session.currentLanguage != null && req.session.currentLanguage != 'default') {
			docsBase = __dirname + '/content.' + req.session.currentLanguage + '/pages/';
		}
		res.render(docsBase + view, options);
	}
}

// Initialise app

var app = express();

app.set('port', 8080);
app.set('view engine', 'jade');

app.use(express.favicon('public/favicon.ico'));
app.use(express.cookieParser());
app.use(express.bodyParser());
app.use(express.cookieSession({
	secret: 'secret'
}));

app.use(require('less-middleware')('public'));
app.use(express.static('public'));

app.use(express.logger('dev'));

// disable cache, safari workaround
// see http://stackoverflow.com/questions/18811286/nodejs-express-cache-and-304-status-code
app.use(function(req, res, next) {
	res.header("Cache-Control", "no-cache, no-store, must-revalidate");
	res.header("Pragma", "no-cache");
	res.header("Expires", 0);
	next();
});

// Set up locals and routes

_.extend(app.locals, content.locals);

app.locals.version = require('../package.json').version;
app.locals.languages = require('./languages.json').languages;

app.use(function(req,res,next){
    res.locals.session = req.session;
    next();
});

_.each(content.routes, function(options) {
	app.get(options.path, view(options.template, options));
});

app.post('/language',function(req,res,next) {
  var language = req.body.language;
  if(req.session.currentLanguage != language) {
	req.session.currentLanguage = language;
	if(language != 'default') {
		var currentContent = require('./content.'+ language +'/site.json');
		_.extend(app.locals, currentContent.locals);
	} else {
		_.extend(app.locals, content.locals);
	}
	
  }
  res.redirect('/');
});

app.use(function(req, res, next) {
	// res.status(404).send("Sorry, no page could be found at this address (404)");
	res.status(404).render('404');
});

app.use(express.errorHandler());

// Start server

http.createServer(app).listen(app.get('port'), function() {
	console.log('Keystone docs are available on port ' + app.get('port'));
});
