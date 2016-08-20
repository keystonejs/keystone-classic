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
		packages: require('./admin/client/packages'),
	},
	output: {
		filename: '[name].js',
		path: path.resolve(__dirname, './admin/public/js'),
	},
	module: {
		loaders: [
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
		new webpack.optimize.CommonsChunkPlugin('packages', 'packages.js'),
	],
};

if (process.env.NODE_ENV === 'production') {
	config = createProdConfig(config);
}

function createProdConfig (config) {
	let plugins = [
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
	return Object.assign({}, config, {
		plugins: config.plugins.concat(plugins),
	});
}

export default config;
