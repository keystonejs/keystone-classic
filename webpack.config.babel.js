import path from 'path';
import webpack from 'webpack';

let config = {
	entry: {
		admin: `${__dirname}/admin/client/App`,
		signin: `${__dirname}/admin/client/Signin`,
		explorer: `${__dirname}/fields/explorer`,
	},
	output: {
		filename: '[name].js',
		path: path.resolve(__dirname, './admin/public/js'),
		// NOTE: we're hardcoding /keystone in the bundle
		publicPath: '/keystone/js/',
		pathinfo: true,
	},
	module: {
		loaders: [
			{
				// Auto-chunk Fields for dynamic loading
				// We cannot chunk Filter due to .getDefaultValue()
				test: /fields\/.*(Field|Column)\.jsx?$/i,
				loader: 'react-proxy',
				exclude: [
					// The field decorator
					/fields\/types\/Field\.js/,
					// Fields using the Array mixin (doesn't like proxy)
					/Array/,
				],
			},
			{
				test: /\.jsx?$/,
				loader: 'babel',
				exclude: [
					/node_modules/,
					`${__dirname}/admin/public/js/`,
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
	],
};

if (process.env.NODE_ENV === 'production') {
	config = createProdConfig(config);
}

function createProdConfig (config) {
	return {
		...config,
		entry: {
			admin: config.entry.admin,
			signin: config.entry.signin,
		},
		output: {
			...config.output,
			pathinfo: false,
		},
		plugins: [
			...config.plugins,
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
			new webpack.optimize.OccurenceOrderPlugin(),
			new webpack.optimize.DedupePlugin(),
		],
	};
}

export default config;
