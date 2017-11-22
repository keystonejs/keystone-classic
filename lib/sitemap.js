/*!
 * Module dependencies.
 */

var expressSitemap = require('express-sitemap');
var	_ = require('underscore');
var	async = require('async');
var moment = require('moment');


/**
 * Generates a sitemap.xml for the site obeying publishing workflow if enabled
 * @param {*} keystone 
 * @param {*} req 
 * @param {*} res 
 * 
 * To enable add the following to your routes/index.js
 * 
 * app.get('/sitemap.xml', function (req, res) {
		keystone.Sitemap.create(keystone, req, res);
	});
 * 
 * Sourced from https://github.com/GenomeUS/keystone-express-sitemap and implemented as a keystone module (vs an external)
 * so that it can integrate with Publishing workflow module and enable checks for published content. 
 * 
 */
var Sitemap = function (keystone, req, res, options) {
	// store routes for express-sitemap function method map option
	var map = {};
	// store routes for express-sitemap function route declaration option
	var route = {};
	var dynamicRoutes = [];
	var dateFormatString = 'YYYY-MM-DD';

	/**
	 * Check existing keystone object lists to see if given string is a name of existing list
	 * Called by create function
	 * @param string {string}	string to check against existing list names
	 */
	var findKeystoneList = function (string) {
		// remove dynamic parameter marker from string
		string = string.replace(':', '').toLowerCase();

		var lists = Object.keys(keystone.lists).map(function (l) {
			return l.toLowerCase();
		});

		var listIndex = lists.indexOf(string);

		if (listIndex >= 0) {
			return keystone.list(Object.keys(keystone.lists)[listIndex]);
		}
		else {
			return null;
		}
	};

	/**
	 * Loop through declared routes to determine which are static and which are tied to dynamic database values (routes with :_id or other similar parameters)
	 * Called by create function
	 */
	var parseRoutes = function () {
		// get keystone route object list
		// keystone projects using express 4.x.x store routes in keystone.app._router.stack
		// keystone projects using express 3.x.x store routes in keystone.app.routes.get
		var routes = keystone.app._router.stack || keystone.app.routes.get;

		if (routes && routes.length > 0) {
		//	console.log('sitemap: routes:' + JSON.stringify(routes));
			routes.forEach(function (v, i) {
				// express 4.x.x route objects have path property
				// express 3.x.x route objects have route.path property
				var path = v.path ? v.path : (v.route ? v.route.path : null);
				
				// remove any kestyone admin paths (/keystone/)
				if (path != null && path.match(/keystone\*{0,1}$|keystone\/|\/\*$|sitemap\.xml/) == null) {
					var ignored = false;

					// check routes against the ignored routes, if applicable
					if (options && options.ignore && Object.prototype.toString.call(options.ignore) === '[object Array]') {
						for (var ig in options.ignore) {
							if (path === options.ignore[ig] || path.match(options.ignore[ig]) !== null) {
								ignored = true;
								break;
							}
						};
					}

					if (ignored) {
						return false;
					}

					// check for dynamic routes (with parameters identified by :[parameter name])
					if (path.indexOf(':') > 0) {
						dynamicRoutes.push(path);
					}
					// route is a static route, add to routes that will be parsed into sitemap
					else {
						map[path] = ['get'];
						route[path] = {};
					}
				}
			});
		}

		// If there are dynamic routes, move to asynchronous function to query database for all routes that would follow that pattern. If not, finish up and generate sitemap.
		if (dynamicRoutes.length > 0) {
			asyncAddListRoutes();
		}
		else {
			createXmlFile();
		}
	};

	/**
	 * Applied to each item in dynamicRoutes array
	 * @param path {string}			express route in the format /path/:param
	 * @param callback {function}	callback function passed from asyncAddListRoutes
	 */
	var addListRoutes = function (path, callback) {
		var paths = path.split('/');
		var list = null;
		var hasCustomRoute = false;
		var dynamicParam = _.find(paths, function (p) {
			return p.indexOf(':') >= 0;
		});

		// Loop through route paths to find keystone list name reference
		// Reference will either be fixed in route, followed by dynamic parameter (/listname/:id), or will be set as the dynamic parameter for a custom route (/custom/:listname)
		for (var p in paths) {
			list = findKeystoneList(paths[p]);
			if (list != null) {
				// route is custom if the list name is the dynamic parameter in the URL
				hasCustomRoute = paths[p] === dynamicParam;
				break;
			}
		}

		if (list != null) {
			// check what property of the list object is being used as the URL identifier, based on keystone model settings
			var idParam = list.options.autokey && list.options.autokey.path ? list.options.autokey.path : '_id';
			
			list.model.find().exec(function (err, results) {
				if (results && results.length > 0) {
					results.forEach(function (v, i) {
						var include = true;

						if (options && options.filters && options.filters[list.key]) {
							include = options.filters[list.key](v);
						}

						// If Publishing workflow is enabled the check that route is in a published state
						// TODO: check if these results are cached
						if (list.publishing && list.publishing.publishStates && v.publishing && v.publishing.state) {
							
							
							if (list.publishing.publishStates.indexOf(v.publishing.state) === -1) {
								include = false;
								console.log('Sitemap:' + v.slug + ' Publishing ENABLED EXCLUDED:'+ v.publishing.state +' | States:' + list.publishing.publishStates);
							} else {
								console.log('Sitemap:' + v.slug + ' Publishing ENABLED:'+ v.publishing.state +' | States:' + list.publishing.publishStates);
							}
						} else {
							console.log('Sitemap:' + v.slug + ' Publishing NOT ENABLED States:');
						}

						if (include) {
							// only define lastModDate if the model has a property tracking when it was last updated
							var lastModDate = v.updatedAt ? moment(v.updatedAt).format(dateFormatString) : null;
							// define page url that will get user access to list item v
							var pageUrl = paths.join('/').replace(dynamicParam, v[idParam]);
							map[pageUrl] = ['get'];
							route[pageUrl] = {
								lastmod: lastModDate,
							};
						}
					});
				}
				callback();
			});
		}
		else {
			callback();
		}
	};

	/**
	 * Initialize asynchronous function to map all possible routes that can be generated by dynamic routes tied to lists
	 * Async to ensure DB queries for each list are all complete before map is created
	 */
	var asyncAddListRoutes = function () {
		async.map(dynamicRoutes, addListRoutes, function (result) {
			createXmlFile();
		});
	};

	/**
	 * Send back the XML sitemap once all routes have been parsed
	 */
	var createXmlFile = function () {
		// express 3.x.x does not define req.hostname, only req.host
		// express 4.x.x has separate parameters for hostname and protocol
		var host = req.hostname ? req.hostname : req.host;
		expressSitemap({
		    map: map,
		    route: route,
		    url: host,
		    http: req.protocol,
		}).XMLtoWeb(res);
	};

	/**
	 * Initialize parsing of declared Express routes into sitemap.xml
	 * @param ks {object}		the keystone object created by application initialization
	 * @param rq {object}		express request object from sitemap.xml route handler function
	 * @param rs {object}		express response object from sitemap.xml route handler function
	 */
	var create = function (ks, rq, rs, opt) {
		// set variables to be used by all other Sitemap functions
		keystone = ks;
		req = rq;
		res = rs;
		options = opt;

		parseRoutes();
	};

	return {
		create: create,
	};
};

module.exports = Sitemap();
