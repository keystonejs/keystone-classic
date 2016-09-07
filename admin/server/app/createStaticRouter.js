/**
 * Returns an Express Router with bindings for the Admin UI static resources,
 * i.e files, less and browserified scripts.
 *
 * Should be included before other middleware (e.g. session management,
 * logging, etc) for reduced overhead.
 *
 * If KEYSTONE_BUILD is specified, it will build keystone live
 * 'dev' uses dev build, 'hot' does hot reload in browser
 * rest builds production build
 * requires webpack and friends
 */

var express = require('express');
var less = require('less-middleware');
var path = require('path');

module.exports = function createStaticRouter (options) {
	var build = options.build || process.env.KEYSTONE_BUILD;
	var isHot = build === 'hot';
	var isDev = build === 'dev';
	var doWatch = isHot || isDev;
	var adminPath = options.adminPath != null ? options.adminPath : '/keystone';
	var entry = options.explorerOnly ? { explorer: `${__dirname}/../../../fields/explorer` } : undefined;

	var customStylesPath = options.customStylesPath || '';
	var router = express.Router();

	/* Prepare LESS options */
	var elementalPath = path.join(path.dirname(require.resolve('elemental')), '..');
	var reactSelectPath = path.join(path.dirname(require.resolve('react-select')), '..');
	var publicDir = path.join(__dirname, '..', '..', 'public');

	var lessOptions = {
		render: {
			modifyVars: {
				elementalPath: JSON.stringify(elementalPath),
				reactSelectPath: JSON.stringify(reactSelectPath),
				customStylesPath: JSON.stringify(customStylesPath),
				adminPath: JSON.stringify(adminPath),
			},
		},
	};

	/* Configure router */
	router.use('/styles', less(path.join(publicDir, 'styles'), lessOptions));
	router.use('/styles/fonts', express.static(path.join(publicDir, 'lib', 'tinymce', 'skins', 'keystone', 'fonts')));

	if (build) {
		var webpack = require('webpack');
		var webpackMW = require('webpack-dev-middleware');

		require('babel-register');
		var webpackConfig = require('../../../webpack.config.babel');

		var config;
		var wpOpts = {
			adminPath: `/${adminPath}`.replace('//', '/'),
			entry: entry,
		};
		if (isHot) {
			config = webpackConfig.getHot(wpOpts);
		} else if (isDev) {
			config = webpackConfig.getDev(wpOpts);
		} else {
			config = webpackConfig.getProd(wpOpts);
		}
		var compiler = webpack(config);

		router.use(webpackMW(
			compiler,
			{
				watchOptions: doWatch ? {
					aggregateTimeout: 100,
				} : undefined,
				publicPath: '/js/',
				stats: {
					cached: false,
					colors: true,
					progress: true,
				},
				headers: doWatch ? {
					// Don't let the browser hang on to old code
					'Cache-Control': 'no-cache, no-store',
				} : undefined,
			}
		));
		if (build === 'hot') {
			var hotMW = require('webpack-hot-middleware');
			router.use(hotMW(compiler));
		}
	}

	router.use(express.static(publicDir));
	// We can add or change things in the publicDir under lib/tinymce/
	// thanks to precedence
	const tinyMceDir = path.dirname(require.resolve('tinymce/tinymce'));
	router.use('/lib/tinymce', express.static(tinyMceDir));

	return router;
};
