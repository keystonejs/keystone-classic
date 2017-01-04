var _ = require('lodash');
var express = require('express');
var fs = require('fs');
var grappling = require('grappling-hook');
var path = require('path');
var utils = require('keystone-utils');

/**
 * Don't use process.cwd() as it breaks module encapsulation
 * Instead, let's use module.parent if it's present, or the module itself if there is no parent (probably testing keystone directly if that's the case)
 * This way, the consuming app/module can be an embedded node_module and path resolutions will still work
 * (process.cwd() breaks module encapsulation if the consuming app/module is itself a node_module)
 */
var moduleRoot = (function (_rootPath) {
	var parts = _rootPath.split(path.sep);
	parts.pop(); // get rid of /node_modules from the end of the path
	return parts.join(path.sep);
})(module.parent ? module.parent.paths[0] : module.paths[0]);


/**
 * Keystone Class
 */
var Keystone = function () {
	grappling.mixin(this).allowHooks('pre:static', 'pre:bodyparser', 'pre:session', 'pre:logger', 'pre:admin', 'pre:routes', 'pre:render', 'updates', 'signin', 'signout');
	this.lists = {};
	this.fieldTypes = {};
	this.paths = {};
	this._options = {
		'name': 'Keystone',
		'brand': 'Keystone',
		'admin path': 'keystone',
		'compress': true,
		'headless': false,
		'logger': ':method :url :status :response-time ms',
		'auto update': false,
		'model prefix': null,
		'module root': moduleRoot,
		'frame guard': 'sameorigin',
		'cache admin bundles': true,
	};
	this._redirects = {};

	// expose express
	this.express = express;

	// init environment defaults
	this.set('env', process.env.NODE_ENV || 'development');

	this.set('port', process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || '3000');
	this.set('host', process.env.HOST || process.env.IP || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0');
	this.set('listen', process.env.LISTEN);

	this.set('ssl', process.env.SSL);
	this.set('ssl port', process.env.SSL_PORT || '3001');
	this.set('ssl host', process.env.SSL_HOST || process.env.SSL_IP);
	this.set('ssl key', process.env.SSL_KEY);
	this.set('ssl cert', process.env.SSL_CERT);

	this.set('cookie secret', process.env.COOKIE_SECRET);
	this.set('cookie signin', (this.get('env') === 'development') ? true : false);

	this.set('embedly api key', process.env.EMBEDLY_API_KEY || process.env.EMBEDLY_APIKEY);
	this.set('mandrill api key', process.env.MANDRILL_API_KEY || process.env.MANDRILL_APIKEY);
	this.set('mandrill username', process.env.MANDRILL_USERNAME);
	this.set('google api key', process.env.GOOGLE_BROWSER_KEY);
	this.set('google server api key', process.env.GOOGLE_SERVER_KEY);
	this.set('ga property', process.env.GA_PROPERTY);
	this.set('ga domain', process.env.GA_DOMAIN);
	this.set('chartbeat property', process.env.CHARTBEAT_PROPERTY);
	this.set('chartbeat domain', process.env.CHARTBEAT_DOMAIN);
	this.set('allowed ip ranges', process.env.ALLOWED_IP_RANGES);

	if (process.env.S3_BUCKET && process.env.S3_KEY && process.env.S3_SECRET) {
		this.set('s3 config', { bucket: process.env.S3_BUCKET, key: process.env.S3_KEY, secret: process.env.S3_SECRET, region: process.env.S3_REGION });
	}

	if (process.env.AZURE_STORAGE_ACCOUNT && process.env.AZURE_STORAGE_ACCESS_KEY) {
		this.set('azurefile config', { account: process.env.AZURE_STORAGE_ACCOUNT, key: process.env.AZURE_STORAGE_ACCESS_KEY });
	}

	if (process.env.CLOUDINARY_URL) {
		// process.env.CLOUDINARY_URL is processed by the cloudinary package when this is set
		this.set('cloudinary config', true);
	}

	// init mongoose
	this.set('mongoose', require('mongoose'));
	this.mongoose.Promise = require('es6-promise').Promise;

	// Attach middleware packages, bound to this instance
	this.middleware = {
		api: require('./lib/middleware/api')(this),
		cors: require('./lib/middleware/cors')(this),
	};
};

_.extend(Keystone.prototype, require('./lib/core/options'));


Keystone.prototype.prefixModel = function (key) {
	var modelPrefix = this.get('model prefix');

	if (modelPrefix) {
		key = modelPrefix + '_' + key;
	}

	return require('mongoose/lib/utils').toCollectionName(key);
};

/* Attach core functionality to Keystone.prototype */
Keystone.prototype.createItems = require('./lib/core/createItems');
Keystone.prototype.createRouter = require('./lib/core/createRouter');
Keystone.prototype.getOrphanedLists = require('./lib/core/getOrphanedLists');
Keystone.prototype.importer = require('./lib/core/importer');
Keystone.prototype.init = require('./lib/core/init');
Keystone.prototype.initDatabaseConfig = require('./lib/core/initDatabaseConfig');
Keystone.prototype.initExpressApp = require('./lib/core/initExpressApp');
Keystone.prototype.initExpressSession = require('./lib/core/initExpressSession');
Keystone.prototype.initNav = require('./lib/core/initNav');
Keystone.prototype.list = require('./lib/core/list');
Keystone.prototype.openDatabaseConnection = require('./lib/core/openDatabaseConnection');
Keystone.prototype.closeDatabaseConnection = require('./lib/core/closeDatabaseConnection');
Keystone.prototype.populateRelated = require('./lib/core/populateRelated');
Keystone.prototype.redirect = require('./lib/core/redirect');
Keystone.prototype.start = require('./lib/core/start');
Keystone.prototype.wrapHTMLError = require('./lib/core/wrapHTMLError');
Keystone.prototype.createKeystoneHash = require('./lib/core/createKeystoneHash');

/* Deprecation / Change warnings for 0.4 */
Keystone.prototype.routes = function () {
	throw new Error('keystone.routes(fn) has been removed, use keystone.set(\'routes\', fn)');
};


/**
 * The exports object is an instance of Keystone.
 */
var keystone = module.exports = new Keystone();

/*
	Note: until #1777 is complete, the order of execution here with the requires
	(specifically, they happen _after_ the module.exports above) is really
	important. As soon as the circular dependencies are sorted out to get their
	keystone instance from a closure or reference on {this} we can move these
	bindings into the Keystone constructor.
*/

// Expose modules and Classes
keystone.Admin = {
	Server: require('./admin/server'),
};
keystone.Email = require('./lib/email');
keystone.Field = require('./fields/types/Type');
keystone.Field.Types = require('./lib/fieldTypes');
keystone.Keystone = Keystone;
keystone.List = require('./lib/list')(keystone);
keystone.Storage = require('./lib/storage');
keystone.View = require('./lib/view');

keystone.content = require('./lib/content');
keystone.security = {
	csrf: require('./lib/security/csrf'),
};
keystone.utils = utils;

/**
 * returns all .js modules (recursively) in the path specified, relative
 * to the module root (where the keystone project is being consumed from).
 *
 * ####Example:
 *     var models = keystone.import('models');
 */

Keystone.prototype.import = function (dirname) {

	var initialPath = path.join(this.get('module root'), dirname);

	var doImport = function (fromPath) {

		var imported = {};

		fs.readdirSync(fromPath).forEach(function (name) {

			var fsPath = path.join(fromPath, name);
			var info = fs.statSync(fsPath);

			// recur
			if (info.isDirectory()) {
				imported[name] = doImport(fsPath);
			} else {
				// only import files that we can `require`
				var ext = path.extname(name);
				var base = path.basename(name, ext);
				if (require.extensions[ext]) {
					imported[base] = require(fsPath);
				}
			}

		});

		return imported;
	};

	return doImport(initialPath);
};


/**
 * Applies Application updates
 */

Keystone.prototype.applyUpdates = function (callback) {
	var self = this;
	self.callHook('pre:updates', function (err) {
		if (err) return callback(err);
		require('./lib/updates').apply(function (err) {
			if (err) return callback(err);
			self.callHook('post:updates', callback);
		});
	});
};


/**
 * Logs a configuration error to the console
 */

Keystone.prototype.console = {};
Keystone.prototype.console.err = function (type, msg) {
	if (keystone.get('logger')) {
		var dashes = '\n------------------------------------------------\n';
		console.log(dashes + 'KeystoneJS: ' + type + ':\n\n' + msg + dashes);
	}
};

/**
 * Keystone version
 */

keystone.version = require('./package.json').version;


// Expose Modules
keystone.session = require('./lib/session');
