const babelify = require('babelify');
const browserify = require('browserify-middleware');
const express = require('express');
const less = require('less-middleware');
const path = require('path');

const packages = require('../../admin/client/packages');

const app = new express();

// Serve script bundles
app.use('/js/explorer.js', browserify('./index.js', {
	external: packages,
	transform: [babelify.configure({
		plugins: [require('babel-plugin-transform-object-rest-spread'), require('babel-plugin-transform-object-assign')],
		presets: [require('babel-preset-es2015'), require('babel-preset-react')],
	})],
}));


// Serve stylesheet and static assets
const elementalPath = path.join(path.dirname(require.resolve('elemental')), '..');
const reactSelectPath = path.join(path.dirname(require.resolve('react-select')), '..');
const lessOptions = {
	render: {
		modifyVars: {
			adminPath: JSON.stringify('/'),
			customStylesPath: '',
			elementalPath: JSON.stringify(elementalPath),
			reactSelectPath: JSON.stringify(reactSelectPath),
		},
	},
};
app.use('/styles', less(path.resolve('../../admin/public/styles'), lessOptions));
app.use('/styles/fonts', express.static(path.resolve('../../admin/public/js/lib/tinymce/skins/keystone/fonts')));
app.use(express.static('../../admin/public'));

// Serve the index template
app.use('/', (req, res) => res.sendFile(path.resolve('./index.html')));

app.listen(8000, function () {
	console.log('Field Types Explorer listening on http://localhost:8000');
});
