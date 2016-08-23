import path from 'path';
import webpack from 'webpack';

const destDir = path.join(__dirname, 'admin', 'public', 'js');

export const dev = {
	entry: {
		admin: `${__dirname}/admin/client/App`,
		signin: `${__dirname}/admin/client/Signin`,
		explorer: `${__dirname}/fields/explorer`,
	},
	output: {
		path: destDir,
		// NOTE: we're hardcoding /keystone in the bundle
		publicPath: '/keystone/js/',
		pathinfo: true,
		filename: '[name].js',
		chunkFilename: '[id].js',
		sourceMapFilename: '[file].map',
	},
	module: {
		loaders: [
			{
				// Auto-chunk Fields for dynamic loading
				// We cannot chunk Filter due to .getDefaultValue()
				test: /fields(\/|\\).*(Field|Column)\.jsx?$/i,
				loader: 'react-proxy',
				exclude: [
					// The field decorator
					path.join(__dirname, 'fields', 'types', 'Field.js'),
					// Fields using the Array mixin (doesn't like proxy)
					/Array/,
				],
			},
			{
				test: /\.jsx?$/,
				loader: 'babel',
				include: [__dirname],
				exclude: [
					path.join(__dirname, 'node_modules'),
					destDir,
				],
			},
			{ test: /\.css$/, loaders: ['style', 'css'] },
			{ test: /\.json$/, loader: 'json' },
			{ test: /\.md$/, loader: 'raw' },
		],
	},
	// Externally loaded dependencies
	externals: {
		jquery: 'jQuery',
		tinymce: 'tinymce',
	},
	plugins: [
		new webpack.DefinePlugin({
			'process.env': {
				NODE_ENV: JSON.stringify(process.env.NODE_ENV),
			},
		}),
		// Only bundle locales we use with moment
		new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /en/),
		new webpack.optimize.CommonsChunkPlugin('common', 'common.js'),
		// Provide consistent build hashes
		new webpack.optimize.OccurenceOrderPlugin(),
	],
};

export const prod = {
	...dev,
	entry: {
		admin: dev.entry.admin,
		signin: dev.entry.signin,
	},
	output: {
		...dev.output,
		pathinfo: false,
	},
	plugins: [
		...dev.plugins,
		// TODO doesn't do anything right now
		new webpack.optimize.MinChunkSizePlugin({ minChunkSize: 14000 }),
		new webpack.optimize.UglifyJsPlugin({
			compress: {
				// Comment this if you want to verify the uglification
				warnings: false,
			},
			output: {
				screw_ie8: true,
				semicolons: false,
			},
		}),
		new webpack.optimize.DedupePlugin(),
	],
};

const hotStuff = [
	'react-hot-loader/patch',
	'webpack-hot-middleware/client?path=/keystone/__webpack_hmr',
];
export const hot = {
	...dev,
	entry: {
		admin: [...hotStuff, dev.entry.admin],
		signin: [...hotStuff, dev.entry.signin],
		explorer: [...hotStuff, dev.entry.explorer],
	},
	module: {
		...dev.module,
		// Strip off the react-proxy-loader and change the react loader
		loaders: [
			{
				test: /\.jsx?$/,
				loader: 'babel',
				query: {
					plugins: 'react-hot-loader/babel',
				},
				include: [__dirname],
				exclude: [
					path.join(__dirname, 'node_modules'),
					destDir,
				],
			},
			...dev.module.loaders.slice(2),
		],
	},
	plugins: [
		...dev.plugins,
		// hot-reload infrastructure
		new webpack.HotModuleReplacementPlugin(),
		// show names instead of module numbers
		new webpack.NamedModulesPlugin(),
	],
};

const config = (process.env.NODE_ENV === 'production') ? prod : dev;
export default config;
