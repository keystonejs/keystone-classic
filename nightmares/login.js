var Nightmare = require('nightmare');
var nightmare = Nightmare({ show: process.env.SHOW_ELECTRON || false });

describe('Keystone Login', function () {
	this.timeout(10000);
	it('Open Login', function (done) {
		nightmare
		.goto('http://localhost:3000/')
		.click('html.no-js > body > a:nth-child(3) > h3:nth-child(1)')
		.type('input[name="email"]', 'user@test.e2e')
		.type('input[name="password"]', 'test')
		.click('button[type="submit"]')
		.wait(500)
		.click('a[href="/keystone/signout"]')
		.end()
		.then(function (result) { done(); })
		.catch(done);
	});
});
