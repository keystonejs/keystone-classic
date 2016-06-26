var path = require('path');
var webpack = require('webpack');

module.exports = {
	resolve: {
		extensions: ['.jsx', '.js'],
		modules: [
			path.resolve(__dirname, 'src'),
			'node_modules'
		],
		alias: {
			FieldTypes: path.resolve(__dirname, 'fields', 'FieldTypes'),
			tinymce: 'tinymce/tinymce.js',
		},
	},
	context: __dirname,
	module: {
		loaders: [
			{
				test: /\.jsx?$/,
				loader: 'babel',
				exclude: [
					path.join(__dirname, 'node_modules'),
					path.join(__dirname, 'dist'),
				],
				// query: {
				// 	presets: [
				// 		'es2015-webpack',
				// 		'react',
				// 	]
				// },
			},
			{
				test: /\.json$/,
				loader: 'json',
			},
		],
	},
	entry: {
		// main: './index',
		code: './fields/types/code/CodeField',
		app: './admin/client/App',
		signin: './admin/client/Signin',
		// common: ['./vendor'], // optional
	},
	output: {
		path: path.join(__dirname, 'dist'),
		filename: '[name].[chunkhash].js',
		chunkFilename: '[chunkhash].js',
	},
	plugins: [
		// new webpack.optimize.CommonsChunkPlugin({
		// 	names: ['common', 'manifest'],
		// }),
		new webpack.optimize.CommonsChunkPlugin({
			name: 'manifest',
		}),
	],
};
