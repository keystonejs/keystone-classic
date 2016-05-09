var dashes = '\n------------------------------------------------\n';
var utils = require('keystone-utils');

module.exports = function bindErrorHandlers (keystone, app) {

	// Handle 404 (no route matched) errors
	var default404Handler = function (req, res) {
		if (req.headers.accept === 'application/json') {
			return res.status(404).json({ error: 'not found' });
		}
		res.status(404).send(keystone.wrapHTMLError('Sorry, no page could be found at this address (404)'));
	};

	app.use(function (req, res, next) {
		var err404 = keystone.get('404');
		if (err404) {
			try {
				if (typeof err404 === 'function') {
					return err404(req, res, next);
				} else if (typeof err404 === 'string') {
					if (req.headers.accept === 'application/json') {
						return res.status(404).json({ error: 'not found' });
					}
					return res.status(404).render(err404);
				} else {
					if (keystone.get('logger')) {
						console.log(dashes + 'Error handling 404 (not found): Invalid type (' + (typeof err404) + ') for 404 setting.' + dashes);
					}
					return default404Handler(req, res, next);
				}
			} catch (e) {
				if (keystone.get('logger')) {
					console.log(dashes + 'Error handling 404 (not found):');
					console.log(e);
					console.log(dashes);
				}
				return default404Handler(req, res, next);
			}
		} else {
			return default404Handler(req, res, next);
		}
	});

	// Handle other errors

	var default500Handler = function (err, req, res, next) { // eslint-disable-line no-unused-vars
		if (keystone.get('logger')) {
			if (err instanceof Error) {
				console.log((err.type ? err.type + ' ' : '') + 'Error thrown for request: ' + req.url);
			} else {
				console.log('Error thrown for request: ' + req.url);
			}
			console.log(err.stack || err);
		}
		// TODO: Take into account dev settings to send a more useful JSON error
		if (req.headers.accept === 'application/json') {
			return res.status(500).json({ error: 'unknown error' });
		}
		var msg = '';
		if (keystone.get('env') === 'development') {
			if (err instanceof Error) {
				if (err.type) {
					msg += '<h2>' + err.type + '</h2>';
				}
				msg += utils.textToHTML(err.message);
			} else if (typeof err === 'object') {
				msg += '<code>' + JSON.stringify(err) + '</code>';
			} else if (err) {
				msg += err;
			}
		}
		return res.status(500).send(keystone.wrapHTMLError('Sorry, an error occurred loading the page (500)', msg));
	};

	app.use(function (err, req, res, next) {
		var err500 = keystone.get('500');
		if (err500) {
			try {
				if (typeof err500 === 'function') {
					return err500(err, req, res, next);
				} else if (typeof err500 === 'string') {
					if (req.headers.accept === 'application/json') {
						return res.status(500).json({ error: 'unknown error' });
					}
					res.locals.err = err;
					return res.status(500).render(err500);
				} else {
					if (keystone.get('logger')) {
						console.log(dashes + 'Error handling 500 (error): Invalid type (' + (typeof err500) + ') for 500 setting.' + dashes);
					}
					return default500Handler(err, req, res, next);
				}
			} catch (e) {
				if (keystone.get('logger')) {
					console.log(dashes + 'Error handling 500 (error):');
					console.log(e);
					console.log(dashes);
				}
				return default500Handler(err, req, res, next);
			}
		} else {
			return default500Handler(err, req, res, next);
		}
	});
};
