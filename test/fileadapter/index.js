/* eslint-env node, mocha */

// This is a set of tests for generic file adapters.
const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const request = require('request');

const nameFunctions = require('../../lib/storage/nameFunctions');

const DUMMY_CONTENT = 'oh hi there this is some test data';

// Create a test suite for the specified keystone FS adapter, using the named
// schema and options.
module.exports = function (Adapter, options, schema) {
	return function () {
		before(function () {
			// Create a temporary file to work with
			this.pathname = path.resolve(os.tmpdir(), 'keystoneadaptertest');
			fs.writeFileSync(this.pathname, DUMMY_CONTENT);
		});

		beforeEach(function () {
			const _options = Object.assign({}, {
				generateFilename: nameFunctions.randomFilename
			}, options);
			this.adapter = new Adapter(_options, schema);
		});

		it('should have a compatibilityLevel of 1', function () {
			assert.strictEqual(Adapter.compatibilityLevel, 1);
		});

		it('can round-trip files', function (done) {
			var adapter = this.adapter; // urgh ES5. My kingdom for a =>
			adapter.uploadFile({
				name: 'abcde.txt',
				mimetype: 'text/plain',
				originalname: 'originalname.txt',
				path: this.pathname,
				size: fs.statSync(this.pathname).size,
			}, function (err, file) {
				if (err) throw err;
				const url = adapter.getFileURL(file);

				request(url, function (err, res) {
					if (err) throw err;
					assert.strictEqual(res.body, DUMMY_CONTENT);

					adapter.removeFile(file, function (err) {
						if (err) throw Error(err);
						done();
					});
				});
			});

		});

		it('deletes the file when you call removeFile');

	};
};
