module.exports = function bindSessionMiddleware(keystone, app) {

	app.use(keystone.get('session options').cookieParser);

	// pre:session hooks
	if ('function' === typeof keystone.get('pre:session')) {
		keystone.get('pre:session')(app);
	}
	app.use(function(req, res, next) {
		keystone.callHook('pre:session', req, res, next);
	});

	app.use(keystone.expressSession);
	app.use(require('connect-flash')());

	if (keystone.get('session') === true) {
		app.use(keystone.session.persist);
	} else if ('function' === typeof keystone.get('session')) {
		app.use(keystone.get('session'));
	}

};
