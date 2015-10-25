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

	// ensure keystone nav has been initialised
	if (!this.nav) {
		debug('setting up nav');
		this.nav = this.initNav();
	}

	// Cache compiled view templates if we are in Production mode
	this.set('view cache', this.get('env') === 'production');

	// Session API
	// TODO: this should respect keystone auth options
	app.get('/keystone/api/session', require('../../admin/server/api/session/get'));
	app.post('/keystone/api/session/signin', require('../../admin/server/api/session/signin'));
	app.post('/keystone/api/session/signout', require('../../admin/server/api/session/signout'));

	// Bind auth middleware (generic or custom) to /keystone* routes, allowing
	// access to the generic signin page if generic auth is used
	if (this.get('auth') === true) {
		if (!this.get('signout url')) {
			this.set('signout url', '/keystone/signout');
		}
		if (!this.get('signin url')) {
			this.set('signin url', '/keystone/signin');
		}
		if (!this.nativeApp || !this.get('session')) {
			app.all('/keystone*', this.session.persist);
		}
		app.all('/keystone/signin', require('../../admin/server/routes/signin'));
		app.all('/keystone/signout', require('../../admin/server/routes/signout'));
		app.all('/keystone*', this.session.keystoneAuth);
	} else if ('function' === typeof this.get('auth')) {
		app.all('/keystone*', this.get('auth'));
	}

	debug('Initialising Admin UI Routes');

	var initList = function (respectHiddenOption) {
		return function (req, res, next) {
			req.list = keystone.list(req.params.list);

			if (!req.list || (respectHiddenOption && req.list.get('hidden'))) {
				debug('could not find list ', req.params.list);
				req.flash('error', 'List ' + req.params.list + ' could not be found.');
				return res.redirect('/keystone');
			}

			debug('getting list ', req.params.list);
			next();
		};
	};

	// Admin UI Home
	app.all('/keystone', require('../../admin/server/routes/home'));

	// Cloudinary API for selecting an existing image / upload a new image
	if (keystone.get('cloudinary config')) {
		debug('setting cloudinary api');
		app.get('/keystone/api/cloudinary/get', require('../../admin/server/api/cloudinary').get);
		app.get('/keystone/api/cloudinary/autocomplete', require('../../admin/server/api/cloudinary').autocomplete);
		app.post('/keystone/api/cloudinary/upload', require('../../admin/server/api/cloudinary').upload);
	}

	// S3 API for uploading a new image
	if (keystone.get('s3 config')) {
		debug('setting S3 api');
		app.post('/keystone/api/s3/upload', require('../../admin/server/api/s3').upload);
	}

	// Init API request helpers
	app.use('/keystone/api', require('../../admin/server/middleware/apiError'));

	// Generic Lists API
	app.all('/keystone/api/counts', require('../../admin/server/api/counts'));
	app.get('/keystone/api/:list', initList(), require('../../admin/server/api/list/get'));
	app.get('/keystone/api/:list/:format(export.csv|export.json)', initList(), require('../../admin/server/api/list/download'));
	app.post('/keystone/api/:list/delete', initList(), require('../../admin/server/api/list/delete'));
	app.get('/keystone/api/:list/:id', initList(), require('../../admin/server/api/item/get'));
	app.post('/keystone/api/:list/:id', initList(), require('../../admin/server/api/item/update'));
	app.post('/keystone/api/:list/:id/delete', initList(), require('../../admin/server/api/item/delete'));

	// DEPRECATED app.all('/keystone/api/:list/:action(autocomplete|order|create|fetch)', initList(), require('../../admin/server/api/list'));
	// DEPRECATED app.all('/keystone/download/:list', initList(), require('../../admin/server/api/download'));

	// Admin UI List
	app.all('/keystone/:list/:page([0-9]{1,5})?', initList(true), require('../../admin/server/routes/list'));
	app.all('/keystone/:list/:item', initList(true), require('../../admin/server/routes/item'));

	return this;
}

module.exports = routes;
