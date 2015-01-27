var debug = require('debug')('keystone:core:routes');
/**
 * Adds bindings for the keystone routes
 *
 * ####Example:
 *
 *     var app = express();
 *     app.use(...); // middleware, routes, etc. should come before keystone is initialised
 *     keystone.routes(app);
 *
 * @param {Express()} app
 * @api public
 */

function routes(app) {
	
	this.app = app;
	var keystone = this;
	var keystoneBaseUrl = 'keystone';
	if (this.get('base url')) {
		keystoneBaseUrl = this.get('base url');
	}
	
	// ensure keystone nav has been initialised
	if (!this.nav) {
	  debug('setting up nav');
		this.nav = this.initNav();
	}
	
	// Cache compiled view templates if we are in Production mode
	this.set('view cache', this.get('env') === 'production');
	
	// Bind auth middleware (generic or custom) to /keystone* routes, allowing
	// access to the generic signin page if generic auth is used
	
	if (this.get('auth') === true) {
		debug('setting up auth');

		if (!this.get('signout url')) {
			this.set('signout url', '/'+keystoneBaseUrl+'/signout');
		}
		if (!this.get('signin url')) {
			this.set('signin url', '/'+keystoneBaseUrl+'/signin');
		}
		
		if (!this.nativeApp || !this.get('session')) {
			app.all('/'+keystoneBaseUrl+'*', this.session.persist);
		}
		
		app.all('/'+keystoneBaseUrl+'/signin', require('../../routes/views/signin'));
		app.all('/'+keystoneBaseUrl+'/signout', require('../../routes/views/signout'));
		app.all('/'+keystoneBaseUrl+'*', this.session.keystoneAuth);
		
	} else if ('function' === typeof this.get('auth')) {
		debug('setting up auth');
		app.all('/'+keystoneBaseUrl+'*', this.get('auth'));
	}
	
	var initList = function(protect) {
		return function(req, res, next) {
			req.list = keystone.list(req.params.list);
			if (!req.list || (protect && req.list.get('hidden'))) {
				debug('could not find list ', req.params.list);
				req.flash('error', 'List ' + req.params.list + ' could not be found.');
				return res.redirect('/'+keystoneBaseUrl+'');
			}
			debug('getting list ', req.params.list);
			next();
		};
	};
	
	debug('setting keystone Admin Route');
	app.all('/'+keystoneBaseUrl+'', require('../../routes/views/home'));
	
	// Email test routes
	if (this.get('email tests')) {
		debug('setting email test routes');
		this.bindEmailTestRoutes(app, this.get('email tests'));
	}
	
	// Cloudinary API for image uploading (only if Cloudinary is configured)
	if (keystone.get('wysiwyg cloudinary images')) {
		if (!keystone.get('cloudinary config')) {
			throw new Error('KeystoneJS Initialisaton Error:\n\nTo use wysiwyg cloudinary images, the \'cloudinary config\' setting must be configured.\n\n');
		}
		debug('setting wysiwyg cloudinary images');
		app.post('/'+keystoneBaseUrl+'/api/cloudinary/upload', require('../../routes/api/cloudinary').upload);
	}
	
	// Cloudinary API for selecting an existing image from the cloud
	if (keystone.get('cloudinary config')) {
		debug('setting cloudinary api');
		app.get('/'+keystoneBaseUrl+'/api/cloudinary/get', require('../../routes/api/cloudinary').get);
		app.get('/'+keystoneBaseUrl+'/api/cloudinary/autocomplete', require('../../routes/api/cloudinary').autocomplete);
	}

	// Generic Lists API
	debug('setting generic list api');
	app.all('/'+keystoneBaseUrl+'/api/:list/:action', initList(), require('../../routes/api/list'));
	
	debug('setting generic Lists download route');
	app.all('/'+keystoneBaseUrl+'/download/:list', initList(), require('../../routes/download/list'));
	
	debug('setting list and item details admin routes');
	app.all('/'+keystoneBaseUrl+'/:list/:page([0-9]{1,5})?', initList(true), require('../../routes/views/list'));
	app.all('/'+keystoneBaseUrl+'/:list/:item', initList(true), require('../../routes/views/item'));
	
	return this;
	
}

module.exports = routes;
