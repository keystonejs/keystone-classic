
function mountExternal(keystone,mountPath, parentApp) {
	
	/* Express sub-app mounting to external app at a mount point (if specified) */
	
	var app = keystone.app;
	
	if (mountPath) {
		//fix root-relative keystone urls for assets (gets around having to re-write all the keystone templates)
		parentApp.all(/^\/keystone($|\/*)/, function(req, res, next) {
			req.url = mountPath + req.url;
			next();
		});
		
		parentApp.use(mountPath, app);
	}
}

module.exports = mountExternal;
