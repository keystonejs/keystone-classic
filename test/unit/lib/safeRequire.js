const demand = require('must');
const proxyquire = require('proxyquire');
const safeRequire = require('../../../lib/safeRequire');

describe('safeRequire', function () {
	describe('given a library that is not installed', function () {
		beforeEach(function () {
			this.oldExit = process.exit;
			process.exit = function (status) {
				return demand(status).eql(1);
			}
		});

		afterEach(function () {
			process.exit = this.oldExit;
		});

		it('throws an error highlighting that the library is not installed', function () {
			try {
				safeRequire('foobarbaz', 'foobarbaz', true);
			} catch (e) {
				demand(e.message).contain('foobarbaz');
			}
		});
	});

	describe('given a library that exists', function () {
		it('returns the required library', function () {
			const localDemand = safeRequire('must');
			localDemand(1).eql(1);
		});
	});
});
