const babelify = require('babelify');
const browserify = require('browserify-middleware');
const express = require('express');
const less = require('less-middleware');
const path = require('path');

const packages = require('../../admin/client/packages');

const app = new express();

// Serve the explorer stylesheet
app.get('/index.css', (req, res) => res.sendFile(path.resolve('./fields/explorer/index.css')));

// Serve script bundles
app.get('/js/explorer.js', browserify('./fields/explorer/index.js', {
	external: packages.concat(['FieldTypes']),
	transform: [
		babelify.configure({
			presets: ['@babel/preset-env', '@babel/preset-react'],
		}),
		require('brfs'),
	],
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
app.use('/styles', less(path.resolve('./admin/public/styles'), lessOptions));
app.use('/styles/fonts', express.static(
	path.resolve('./admin/public/js/lib/tinymce/skins/keystone/fonts')
));
app.use(express.static('./admin/public'));

// Stub API for Relationships
app.get('/api/flavours', (req, res) => res.json({
	results: [
		{ id: 'chocolate', name: 'Chocolate' },
		{ id: 'vanilla', name: 'Vanilla' },
		{ id: 'strawberry', name: 'Strawberry' },
	],
	count: 3,
}));

// Serve the index template
app.use('/', (req, res) => res.sendFile(path.resolve('./fields/explorer/index.html')));

app.listen(8000, function () {
	console.log('Field Types Explorer ready on http://localhost:8000');
});
