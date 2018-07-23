var demand = require('must');
var proxyquire = require('proxyquire');
var sinon = require('sinon');

describe('Email', function () {
	/**
	 * SETUP
	 */
	var keystoneEmail;
	var Email;

	beforeEach(function () {
		// Make the tests work no matter if keystone-email is installed or not, spying on the mocked
		// keystone-email
		keystoneEmail = sinon.spy();
		Email = proxyquire('../../../lib/email', { 'keystone-email': keystoneEmail });
	});

	/**
	 * TESTS
	 */
	it('should require options to be passed in', function () {
		demand(Email).throw(/requires a templateName or options argument/);
	});
});
