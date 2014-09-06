function mountRoutes(keystone) {
	
	// Route requests
	
	var app = keystone.app;
	
	app.use(app.router);
	
	// Headless mode means don't bind the Keystone routes
	
	if (!keystone.get('headless')) {
		keystone.routes(app);
	}
	
	
	// Configure application routes
	if ('function' === typeof keystone.get('routes')) {
		keystone.get('routes')(app);
	}
}

module.exports = mountRoutes;
