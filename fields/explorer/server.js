const express = require('express');
const createStaticRouter = require('../../admin/server/app/createStaticRouter');

const app = new express();

// Serve the explorer index.html and friends
app.use('/', express.static(__dirname));

// Stub API for Relationships
app.get('/api/flavours', (req, res) => res.json({
	results: [
		{ id: 'chocolate', name: 'Chocolate' },
		{ id: 'vanilla', name: 'Vanilla' },
		{ id: 'strawberry', name: 'Strawberry' },
	],
	count: 3,
}));

app.use('/', createStaticRouter({}));

// All other routes get index.html
app.use('/', (req, res) => res.sendFile(__dirname + '/index.html'));

app.listen(8000, function () {
	console.log('Field Types Explorer ready on http://localhost:8000');
});
