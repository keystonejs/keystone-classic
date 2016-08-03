import path from 'path';
import webpack from 'webpack';

let config = {
	entry: {
		// admin ui bundle
		admin: path.resolve(__dirname, './admin/client/index'),
		// fields/filters bundle
		fields: [
			path.resolve(__dirname, './admin/client/fields'),
			path.resolve(__dirname, './admin/client/filters')
		],
		// packages bundle
		packages: [
			'async',
			'blacklist',
			'bytes',
			'classnames',
			'color',
			'display-name',
			'elemental',
			'expression-match',
			'history',
			'i',
			'list-to-array',
			'marked',
			'moment',
			'numeral',
			'qs',
			'react-addons-css-transition-group',
			'react-alt-text',
			'react-color',
			'react-day-picker',
			'react-dnd',
			'react-dnd-html5-backend',
			'react-dom',
			'react-select',
			'react',
			'store-prototype',
			'vkey',
			'xhr'
		]
	},
	output: {
		filename: '[name].bundle.js',
		path: path.resolve(__dirname, './admin/public/js')
	},
	module: {
		loaders: [
			{ test: /\.jsx?$/, loader: 'babel', exclude: /node_modules/ }
		]
	},
	plugins: [
		new webpack.DefinePlugin({
			ENV: JSON.stringify(process.env.NODE_ENV)
		}),
		new webpack.optimize.CommonsChunkPlugin('packages', 'packages.bundle.js')
	]
}

if (process.env.NODE_ENV === 'production') {
	config = createProdConfig(config);
}

function createProdConfig(config) {
	let plugins = [
		new webpack.optimize.UglifyJsPlugin({
		    compress: {
		        warnings: false
		    },
		    mangle: true,
		    output: {
		    	comments: false,
		    	screw_ie8: true,
				semicolons: false
		   	}
		})
	];
	return Object.assign({}, config, {
		plugins: config.plugins.concat(plugins)
	});
}

export default config;
