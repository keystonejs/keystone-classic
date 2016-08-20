import path from 'path';
import webpack from 'webpack';

let config = {
	entry: {
		// admin ui bundle
		// admin: path.resolve(__dirname, './admin/client/index'),
		// fields/filters bundle
		// fields: [
		// 	path.resolve(__dirname, './admin/client/fields'),
		// 	path.resolve(__dirname, './admin/client/filters'),
		// ],
		// packages bundle
		admin: `${__dirname}/admin/client/App`,
		signin: `${__dirname}/admin/client/Signin`,
	},
	output: {
		filename: '[name].js',
		path: path.resolve(__dirname, './admin/public/js'),
		// NOTE: hardcoding keystone
		publicPath: '/keystone/js/',
		pathinfo: true,
	},
	module: {
		loaders: [
			{
				test: /fields\/.*(Field|Column|Filter)\.jsx?$/i,
				loader: 'react-proxy',
				exclude: [
					// The field decorator
					/fields\/types\/Field\.js/,
					// Fields using the Array mixin (doesn't like proxy)
					/Array/,
				],
			},
			{ test: /\.jsx?$/, loader: 'babel', exclude: /node_modules/ },
		],
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
	let plugins = [
		...config.plugins,
		// TODO doesn't do anything right now
		new webpack.optimize.MinChunkSizePlugin({ minChunkSize: 14000 }),
		new webpack.optimize.UglifyJsPlugin({
			compress: {
				warnings: false,
			},
			mangle: true,
			output: {
				comments: false,
				screw_ie8: true,
				semicolons: false,
			},
		}),
		new webpack.optimize.OccurenceOrderPlugin(),
		new webpack.optimize.DedupePlugin(),
	];
	return {
		...config,
		output: {
			...config.output,
			pathinfo: false,
		},
		plugins,
	};
}

export default config;
