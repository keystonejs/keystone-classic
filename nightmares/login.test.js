var createNightmare = require('./createNightmare');
var demand = require('must');
var login = require('./plugins/login');

describe('Keystone Login', function () {
	this.timeout(10000);
	it('Open Login then logout', function () {
		return createNightmare()
		.use(login())
		.click('a[href="/keystone/signout"]')
		.evaluate(function () {
			return document.location.href;
		})
		.end()
		.then(function (url) {
			demand(url).equal('http://localhost:3000/keystone/signin?signedout');
		});
	});
	it('Failed Login', function () {
		return createNightmare()
		.goto('http://localhost:3000/')
		.click('html.no-js > body > a:nth-child(3) > h3:nth-child(1)')
		.type('input[name="email"]', 'user@test.e2e')
		.type('input[name="password"]', 'test2')
		.click('button[type="submit"]')
		.end();
	});
	it('Redirect Login', function () {
		return createNightmare()
		.goto('http://localhost:3000/keystone/users')
		.end()
		.then(function (result) {
			demand(result.url).equal('http://localhost:3000/keystone/signin?from=/keystone/users');
		});
	});
	it('Open Login then logout assert the login screen is shown', function () {
		return createNightmare()
		.use(login())
		.click('a[href="/keystone/signout"]')
		.evaluate(function () {
			return document.querySelector('img').src;
		})
		.end()
		.then(function (url) {
			demand(url).equal('http://localhost:3000/keystone/images/logo.png');
		});
	});
});
