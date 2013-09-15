var http = require('http'),
	express = require('express'),
	jade = require('jade');

var app = express();

app.set('port', 8080);
app.set('views', 'content/templates/views');
app.set('view engine', 'jade');

app.use(express.favicon('public/favicon.ico'));
app.use(require('less-middleware')({ src: 'public' }));
app.use(express.static('public'));

app.use(express.logger('dev'));

require('./lib/routes')(app);

app.use(function(req, res, next) {
	res.status(404).send("Sorry, no page could be found at this address (404)");
});

app.use(express.errorHandler());

http.createServer(app).listen(app.get('port'), function() {
	console.log('Keystone docs are available on port ' + app.get('port'));
});
