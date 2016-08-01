/* eslint-env node, mocha */

// This is a set of tests for generic file adapters.
const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const request = require('request');

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
			this.adapter = new Adapter(options, schema);
		});

		it('should have a compatibilityLevel of 1', function () {
			assert.strictEqual(Adapter.compatibilityLevel, 1);
		});

		it('can round-trip files', function (done) {
			const adapter = this.adapter; // urgh ES5.
			adapter.uploadFile({
				name: 'abcde.txt',
				mimetype: 'text/plain',
				originalname: 'originalname.txt',
				path: this.pathname,
				size: fs.statSync(this.pathname).size,
			}, function (err, result) {
				if (err) throw err;
				const url = adapter.getFileURL(result);

				request(url, function (err, res) {
					if (err) throw err;
					assert.strictEqual(res.body, DUMMY_CONTENT);
					done();
				});
			});

		});

	};
};
