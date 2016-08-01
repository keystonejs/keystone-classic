/* eslint-env node, mocha */

var path = require('path');
var os = require('os');
var express = require('express');
var http = require('http');

var FSAdapter = require('../../../../lib/storage/adapters/fs');


describe('fs adapter', function () {
	// To be able to do the round-trip storage test we'll need to spin up a simple
	// web server.
	var uploadpath = path.resolve(os.tmpdir(), '_keystonetest');

	before(function (done) {
		var app = express();
		app.use('/publicfiles', express.static(uploadpath));

		this.server = http.createServer(app).listen(3339, done); // hopefully obscure enough
	});

	// TODO: afterEach should delete the uploadPath directory.
	require('../../../fileadapter')(FSAdapter, {
		// whenExists: 'overwrite',
		fs: {
			path: uploadpath,
			publicPath: 'http://localhost:3339/publicfiles/',
		},
	}, {
		filename: true,
		size: true,
		mimetype: true,
		path: true,
		originalname: true,
		url: true,
	})();

	after(function (done) {
		this.server.close(done);
	});

});
