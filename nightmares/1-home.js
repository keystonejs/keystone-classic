var createNightmare = require('./createNightmare');
var login = require('./plugins/login');
var demand = require('must');
var fixtures = require('./fixtures');

describe('App', function () {
	this.timeout(10000);

	it('Should show the home view', function () {
		return createNightmare()
		.use(login())
		.evaluate(function () {
			return !!document.querySelector('[data-screen-id="home"]');
		})
		.end()
		.then(function (result) {
			demand(result).be.true(true);
		});
	});

	it('Should show groups with the following items', function () {
		return createNightmare()
		.use(login())
		.evaluate(function () {
			return document.querySelector('[data-screen-id="home"]').innerText;
		})
		.end()
		.then(function (result) {
			demand(result).to.equal(fixtures.homepageText);
		});
	});
});
