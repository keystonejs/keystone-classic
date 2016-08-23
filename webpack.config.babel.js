import path from 'path';
import webpack from 'webpack';

const destDir = path.join(__dirname, 'admin', 'public', 'js');

const proxyLoader = {
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
};
const babelLoader = {
	test: /\.jsx?$/,
	loader: 'babel',
	include: [__dirname],
	exclude: [
		path.join(__dirname, 'node_modules'),
		destDir,
	],
};

const getBase = ({ adminPath = '/keystone', entry } = {}) => {
	console.log(adminPath, entry)
	return {
		entry: entry || {
			admin: `${__dirname}/admin/client/App`,
			signin: `${__dirname}/admin/client/Signin`,
		},
		// https://webpack.github.io/docs/configuration.html#devtool
		devtool: 'eval',
		output: {
			path: destDir,
			publicPath: `${adminPath}/js/`,
			pathinfo: true,
			filename: '[name].js',
			chunkFilename: '[id].js',
			sourceMapFilename: '[file].map',
		},
		module: {
			loaders: [
				proxyLoader,
				babelLoader,
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
};

export const getDev = (options) => getBase(options);

export const getProd = (options) => {
	const base = getBase(options);
	return {
		...base,
		// Not sure if useful, gets quite big
		// devtool: 'source-map',
		devtool: undefined,
		output: {
			...base.output,
			pathinfo: false,
		},
		plugins: [
			...base.plugins,
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
};

export const getHot = (options = {}) => {
	const { adminPath = '/keystone' } = options;
	const hmrPath = `${adminPath}/__webpack_hmr`.replace('//', '/');
	const hotStuff = [
		'react-hot-loader/patch',
		`webpack-hot-middleware/client?path=${hmrPath}`,
	];
	const base = getBase(options);
	const entry = {};
	// Prepend hot entry code
	for (const name of Object.keys(base.entry)) {
		entry[name] = [...hotStuff, base.entry[name]];
	}
	// Strip off the react-proxy-loader and change the react loader
	const loaders = base.module.loaders
	.filter(l => l !== proxyLoader)
	.map(l => l === babelLoader ? ({
		...babelLoader,
		query: {
			plugins: 'react-hot-loader/babel',
		},
	}) : l)
	;
	return {
		...base,
		entry,
		module: {
			...base.module,
			loaders,
		},
		plugins: [
			...base.plugins,
			// hot-reload infrastructure
			new webpack.HotModuleReplacementPlugin(),
			// show names instead of module numbers
			new webpack.NamedModulesPlugin(),
		],
	};
};

const getConfig = (process.env.NODE_ENV === 'production') ? getProd : getDev;
export default getConfig();
