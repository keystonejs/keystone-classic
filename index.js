var fs = require('fs'),
	path = require('path'),
	_ = require('underscore'),
	express = require('express'),
	async = require('async'),
	jade = require('jade'),
	moment = require('moment'),
	numeral = require('numeral'),
	cloudinary = require('cloudinary'),
	utils = require('keystone-utils');

var templateCache = {};

/**
 * Don't use process.cwd() as it breaks module encapsulation
 * Instead, let's use module.parent if it's present, or the module itself if there is no parent (probably testing keystone directly if that's the case)
 * This way, the consuming app/module can be an embedded node_module and path resolutions will still work
 * (process.cwd() breaks module encapsulation if the consuming app/module is itself a node_module)
 */
var moduleRoot = (function(_rootPath) {
	var parts = _rootPath.split(path.sep);
	parts.pop(); //get rid of /node_modules from the end of the path
	return parts.join(path.sep);
})(module.parent ? module.parent.paths[0] : module.paths[0]);


/**
 * Keystone Class
 *
 * @api public
 */

var Keystone = function() {
	
	this.lists = {};
	this.paths = {};
	this._options = {
		'name': 'Keystone',
		'brand': 'Keystone',
		'compress': true,
		'headless': false,
		'logger': 'dev',
		'auto update': false,
		'model prefix': null
	};
	this._pre = {
		routes: [],
		render: []
	};
	this._redirects = {};
	
	// expose express
	
	this.express = express;
	
	
	// init environment defaults
	
	this.set('env', process.env.NODE_ENV || 'development');
	
	this.set('port', process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT);
	this.set('host', process.env.HOST || process.env.IP || process.env.OPENSHIFT_NODEJS_IP);
	this.set('listen', process.env.LISTEN);
	
	this.set('ssl', process.env.SSL);
	this.set('ssl port', process.env.SSL_PORT);
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
	
	// Attach middleware packages, bound to this instance
	this.initAPI = require('./lib/middleware/initAPI')(this);
	this.cors = require('./lib/middleware/cors')(this);
	
};

_.extend(Keystone.prototype, require('./lib/core/options')(moduleRoot));


/**
 * Registers a pre-event handler.
 *
 * Valid events include:
 * - `routes` - calls the function before any routes are matched, after all other middleware
 *
 * @param {String} event
 * @param {Function} function to call
 * @api public
 */

Keystone.prototype.pre = function(event, fn) {
	if (!this._pre[event]) {
		throw new Error('keystone.pre() Error: event ' + event + ' does not exist.');
	}
	this._pre[event].push(fn);
	return this;
};


Keystone.prototype.prefixModel = function (key) {
	var modelPrefix = this.get('model prefix');
	
	if (modelPrefix)
		key = modelPrefix + '_' + key;
	
	return require('mongoose/lib/utils').toCollectionName(key);
};

/* Attach core functionality to Keystone.prototype */
Keystone.prototype.init = require('./lib/core/init');
Keystone.prototype.initNav = require('./lib/core/initNav');
Keystone.prototype.connect = require('./lib/core/connect');
Keystone.prototype.start = require('./lib/core/start');
Keystone.prototype.mount = require('./lib/core/mount');
Keystone.prototype.routes = require('./lib/core/routes');
Keystone.prototype.static = require('./lib/core/static');
Keystone.prototype.render = require('./lib/core/render');
Keystone.prototype.importer = require('./lib/core/importer');
Keystone.prototype.createItems = require('./lib/core/createItems');
Keystone.prototype.populateRelated = require('./lib/core/populateRelated');
Keystone.prototype.redirect = require('./lib/core/redirect');
Keystone.prototype.list = require('./lib/core/list');
Keystone.prototype.getOrphanedLists = require('./lib/core/getOrphanedLists');
Keystone.prototype.bindEmailTestRoutes = require('./lib/core/bindEmailTestRoutes');
Keystone.prototype.wrapHTMLError = require('./lib/core/wrapHTMLError');


/**
 * The exports object is an instance of Keystone.
 *
 * @api public
 */

var keystone = module.exports = exports = new Keystone();

// Expose modules and Classes
keystone.utils = utils;
keystone.content = require('./lib/content');
keystone.List = require('./lib/list');
keystone.Field = require('./lib/field');
keystone.Field.Types = require('./lib/fieldTypes');
keystone.View = require('./lib/view');
keystone.Email = require('./lib/email');

keystone.security = {
	csrf: require('./lib/security/csrf')
};


/**
 * returns all .js modules (recursively) in the path specified, relative
 * to the module root (where the keystone project is being consumed from).
 *
 * ####Example:
 *
 *     var models = keystone.import('models');
 *
 * @param {String} dirname
 * @api public
 */

Keystone.prototype.import = function(dirname) {
	
	var initialPath = path.join(moduleRoot, dirname);
	
	var doImport = function(fromPath) {
		
		var imported = {};
		
		fs.readdirSync(fromPath).forEach(function(name) {
			
			var fsPath = path.join(fromPath, name),
			info = fs.statSync(fsPath);
			
			// recur
			if (info.isDirectory()) {
				imported[name] = doImport(fsPath);
			} else {
				// only import files that we can `require`
				var ext  = path.extname(name);
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

Keystone.prototype.applyUpdates = function(callback) {
	require('./lib/updates').apply(callback);
};


/**
 * Logs a configuration error to the console
 *
 * @api public
 */

Keystone.prototype.console = {};
Keystone.prototype.console.err = function(type, msg) {
	
	if (keystone.get('logger')) {
		var dashes = '\n------------------------------------------------\n';
		console.log(dashes + 'KeystoneJS: ' + type + ':\n\n' + msg + dashes);
	}
	
};

/**
 * Keystone version
 *
 * @api public
 */

keystone.version = require('./package.json').version;


// Expose Modules
keystone.session = require('./lib/session');
