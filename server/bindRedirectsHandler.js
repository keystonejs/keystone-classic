module.exports = function bindErrorHandlers (keystone, app) {
	if (Object.keys(keystone._redirects).length) {
		app.use(function (req, res, next) {
			if (keystone._redirects[req.path]) {
				res.redirect(keystone._redirects[req.path]);
			} else {
				next();
			}
		});
	}
};
