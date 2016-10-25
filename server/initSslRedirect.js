module.exports = function (keystone, app) {
	var portString;
	function sslRedirect (req, res, next) {
		if (req.secure) {
			next();
		} else {
			// Don't redirect connections from localhost
			if (req.ip === '127.0.0.1') {
				return next();
			} else {
				res.redirect(302, 'https://' + req.hostname + portString + req.originalUrl);
			}
		}
	};

	if (keystone.get('ssl') === 'force') {
		var port = keystone.get('ssl public port') || keystone.get('ssl port');
		if (Number(port) === 443) {
			portString = '';
		} else {
			portString = ':' + port;
		}
		app.use(sslRedirect);
	}
};
