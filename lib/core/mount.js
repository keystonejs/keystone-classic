/**
 * Configures a Keystone app in encapsulated mode, but does not start it.
 *
 * Connects to the database and runs updates and then calls back.
 *
 * This is the code-path to use if you'd like to mount the keystone app as a sub-app in another express application.
 *
 *   var app = express();
 *
 *   //...do your normal express setup stuff, add middleware and routes (but not static content or error handling middleware yet)
 *
 *   keystone.mount('/content', app, function() {
 *	 //put your app's static content and error handling middleware here and start your server
 *   });
 *
 * Events are fired during initialisation to allow customisation, including:
 *
 *   - onMount
 *
 * If the events argument is a function, it is assumed to be the mounted event.
 *
 *
 * ####Options:
 *
 * Keystone supports the following options specifically for running in encapsulated mode (with no embedded server):
 *
 *   - name
 *   - port
 *   - views
 *   - view engine
 *   - compress
 *   - favico
 *   - less
 *   - static
 *   - headless
 *   - logger
 *   - cookie secret
 *   - session
 *   - 404
 *   - 500
 *   - routes
 *   - locals
 *   - auto update
 *
 *
 * @api public
 */

var _ = require('underscore');
var debug = require('debug')('keystone:core:mount');
var express = require('express');
var path = require('path');
var utils = require('keystone-utils');
var favicon = require('serve-favicon');
var morgan = require('morgan');
var methodOverride = require('method-override');
var multer = require('multer');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var compression = require('compression');

var dashes = '\n------------------------------------------------\n';

function mount(events) {
	debug('mounting');
	// Validate the express app instance

	if (!this.app) {
		console.error('\nKeystoneJS Initialisaton Error:\n\napp must be initialised. Call keystone.init() or keystone.connect(new Express()) first.\n');
		process.exit(1);
	}

	// Localise references to this for closures

	var keystone = this;
	var app = this.app;

	// this.nativeApp indicates keystone has been mounted natively
	// (not as part of a custom middleware stack)
	//
	this.nativeApp = true;

	// Initialise the mongo connection url

	if (!this.get('mongo')) {
		var dbName = this.get('db name') || utils.slug(this.get('name'));
		var dbUrl = process.env.MONGO_URI || process.env.MONGO_URL || process.env.MONGODB_URL || process.env.MONGOLAB_URI || process.env.MONGOLAB_URL || (process.env.OPENSHIFT_MONGODB_DB_URL || 'mongodb://localhost/') + dbName;
		debug('setting DB URI to : ' + dbUrl);
		this.set('mongo', dbUrl);
	}

	// Initialise the session store
	this.initExpressSession();

	if ('function' === typeof events) {
		events = { onMount: events };
	}

	if (!events) events = {};

	/* Keystone's encapsulated Express App Setup */

	// Allow usage of custom view engines
	if (this.get('custom engine')) {
		app.engine(this.get('view engine'), this.get('custom engine'));
	}

	// Set location of view templates and view engine
	app.set('views', this.getPath('views') || path.sep + 'views');
	app.set('view engine', this.get('view engine'));

	// Apply locals
	if (utils.isObject(this.get('locals'))) {
		_.extend(app.locals, this.get('locals'));
	}

	// Indent HTML everywhere, except production
	if (this.get('env') !== 'production') {
		app.locals.pretty = true;
	}

	// Default view caching logic
	app.set('view cache', this.get('env') === 'production' ? true : false);

	// Setup view caching from app settings
	if (this.get('view cache') !== undefined) {
		app.set('view cache', this.get('view cache'));
	}

	// Compress response bodies
	if (this.get('compress')) {
		app.use(compression());
	}

	// Pre static config
	if ('function' === typeof this.get('pre:static')) {
		debug('configuring pre:static middleware');
		this.get('pre:static')(app);
	}
	app.use(function(req, res, next) {
		keystone.callHook('pre:static', req, res, next);
	});

	// Serve static assets

	if (this.get('favico')) {
		app.use(favicon(this.getPath('favico')));
	}

	// unless the headless option is set (which disables the Admin UI),
	// add the Admin UI's Static Router for public resources
	if (!this.get('headless')) {
		app.use('/keystone', require('../../admin/app/static'));
	}

	// the less option can be a single path, or array of paths
	// when set, we configure the less middleware

	var lessPaths = this.get('less');
	var lessOptions = this.get('less options') || {};

	if (_.isString(lessPaths)) {
		lessPaths = [lessPaths];
	}

	if (_.isArray(lessPaths)) {
		_.each(lessPaths, function(value) {
			app.use(require('less-middleware')(this.expandPath(value), lessOptions));
		}, this);
	}

	// the sass option can be a single path, or array of paths
	// when set, we configure the node-sass middleware

	var sassPaths = this.get('sass');
	var sassOptions = this.get('sass options') || {};

	if (_.isString(sassPaths)) {
		sassPaths = [sassPaths];
	}

	if (_.isArray(sassPaths)) {
		var sassMiddleware;
		try {
			debug('adding sass');
			sassMiddleware = require('node-sass-middleware');
		} catch(e) {
			if (e.code === 'MODULE_NOT_FOUND') {
				console.error(
					'\nERROR: node-sass not found.\n' +
					'\nPlease install the node-sass-middleware from npm to use the `sass` option.' +
					'\nYou can do this by running "npm install node-sass-middleware --save".\n'
				);
				process.exit(1);
			} else {
				throw e;
			}
		}
		_.each(sassPaths, function(value) {
			app.use(sassMiddleware(_.extend({
				src: this.expandPath(value),
				dest: this.expandPath(value),
				outputStyle: this.get('env') === 'production' ? 'compressed' : 'nested'
			}, sassOptions)));
		}, this);
	}

	// the static option can be a single path, or array of paths
	// when set, we configure the express static middleware

	var staticPaths = this.get('static');
	var staticOptions = this.get('static options');

	if (_.isString(staticPaths)) {
		staticPaths = [staticPaths];
	}

	if (_.isArray(staticPaths)) {
		_.each(staticPaths, function(value) {
			app.use(express.static(this.expandPath(value), staticOptions));
		}, this);
	}

	// Log dynamic requests
	if (this.get('logger')) {
		debug('adding request logger');
		app.use(morgan(this.get('logger'), this.get('logger options')));
	}

	// Pre bodyparser middleware
	if ('function' === typeof this.get('pre:bodyparser')) {
		debug('configuring pre:bodyparser middleware');
		this.get('pre:bodyparser')(app);
	}
	app.use(function(req, res, next) {
		keystone.callHook('pre:bodyparser', req, res, next);
	});

	// Set up body options and cookie parser
	var bodyParserParams = {};

	if (this.get('file limit')) {
		debug('adding file limit');
		bodyParserParams.limit = this.get('file limit');
	}

	app.use(bodyParser.json(bodyParserParams));
	bodyParserParams.extended = true;
	app.use(bodyParser.urlencoded(bodyParserParams));
	app.use(methodOverride());
	app.use(sessionOptions.cookieParser);

	// Pre session config
	if ('function' === typeof this.get('pre:session')) {
		debug('configuring pre:session middleware');
		this.get('pre:session')(app);
	}
	app.use(function(req, res, next) {
		keystone.callHook('pre:session', req, res, next);
	});

	app.use(this.expressSession);
	app.use(multer({
		includeEmptyFields: true
	}));
	app.use(require('connect-flash')());

	if (this.get('session') === true) {
		app.use(this.session.persist);
	} else if ('function' === typeof this.get('session')) {
		app.use(this.get('session'));
	}

	// Add 'X-Frame-Options' to response header for ClickJacking protection
	if (this.get('frame guard')) {
		debug('enabling frame guard');
		app.use(require('../security/frameGuard')(this));
	}

	// Process 'X-Forwarded-For' request header
	if (this.get('trust proxy') === true) {
		debug('enabling trusted proxy');
		app.enable('trust proxy');
	} else {
		app.disable('trust proxy');
	}

	// Check for IP range restrictions
	if (this.get('allowed ip ranges')) {
		if (!app.get('trust proxy')) {
			console.log(
				'KeystoneJS Initialisaton Error:\n\n' +
				'to set IP range restrictions the "trust proxy" setting must be enabled.\n\n'
			);
			process.exit(1);
		}
		debug('adding IP ranges', this.get('allowed ip ranges'));
		app.use(require('../security/ipRangeRestrict')(
			this.get('allowed ip ranges'),
			this.wrapHTMLError
		));
	}

	// Pre route config

	// Pre session config
	if ('function' === typeof this.get('pre:routes')) {
		debug('configuring pre:routes middleware');
		this.get('pre:routes')(app);
	}
	app.use(function(req, res, next) {
		keystone.callHook('pre:routes', req, res, next);
	});

	// unless the headless option is set (which disables the Admin UI),
	// include the Admin UI route handlers
	if (!this.get('headless')) {
		debug('adding keystone routes to express app');
		this.routes(app);
	}


	// Configure application routes
	if ('function' === typeof this.get('routes')) {
		debug('configuring app routes');
		this.get('routes')(app);
	}

	require('../../server/bindRedirectsHandler')(this, app);
	require('../../server/bindErrorHandlers')(this, app);

	// Connect to database

	var mongoConnectionOpen = false;

	// support replica sets for mongoose
	if (this.get('mongo replica set')){
		debug('setting up mongo replica set');
		var replicaData = this.get('mongo replica set');
		var replica = '';

		var credentials = (replicaData.username && replicaData.password) ? replicaData.username + ':' + replicaData.password + '@' : '';

		replicaData.db.servers.forEach(function (server) {
			replica += 'mongodb://' + credentials + server.host + ':' + server.port + '/' + replicaData.db.name + ',';
		});

		var options = {
			auth: { authSource: replicaData.authSource },
			replset: {
				rs_name: replicaData.db.replicaSetOptions.rs_name,
				readPreference: replicaData.db.replicaSetOptions.readPreference
			}
		};

		debug('connecting to replicate set');
		this.mongoose.connect(replica, options);

	} else {
		debug('connecting to mongo');
		this.mongoose.connect(this.get('mongo'));

	}

	this.mongoose.connection.on('error', function(err) {

		if (keystone.get('logger')) {
			console.log('------------------------------------------------');
			console.log('Mongo Error:\n');
			console.log(err);
		}

		if (mongoConnectionOpen) {
			if (err.name === 'ValidationError') return;
			throw err;
		} else {
			throw new Error('KeystoneJS (' + keystone.get('name') + ') failed to start - Check that you are running `mongod` in a separate process.');
		}

	}).on('open', function() {

		debug('mongo connection open');
		mongoConnectionOpen = true;

		var mounted = function() {
			events.onMount && events.onMount();// eslint-disable-line no-unused-expressions
		};

		var connected = function() {
			if (keystone.get('auto update')) {
				debug('applying auto update');
				keystone.applyUpdates(mounted);
			} else {
				mounted();
			}
		};

		if (this.sessionStorePromise) {
			this.sessionStorePromise.then(connected);
		} else {
			connected();
		}

	});
}

module.exports = mount;
