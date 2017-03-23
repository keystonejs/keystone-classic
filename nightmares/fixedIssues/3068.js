var demand = require('must');
var createNightmare = require('../createNightmare');
var login = require('../plugins/login');
var navigationClick = require('../plugins/navigationClick');

// ensure the problem still exists https://github.com/keystonejs/keystone/issues/3068
describe('#3068 is Fixed', function () {
	this.timeout(400000);

	it('Describe issue', function () {
		return createNightmare()
		.use(login())
		.use(navigationClick('date-field-maps'))
		.use(navigationClick('dependency-bs'))
		.wait('button[data-e2e-list-create-button]')
		.click('button[data-e2e-list-create-button]')
		.wait('button.octicon')
		.click('button.octicon')
		.wait('button[type="submit"]')
		.click('button[type="submit"]')
		.wait(500) // this is required to click the following element
		.click('button.octicon')
		.wait('.Select-control')
		.type('.Select-control input', 'Spam\u000d')
		.wait('button[data-button="update"]')
		.click('button[data-button="update"]')
		.use(navigationClick('date-field-maps'))
		.use(navigationClick('dependency-as'))
		.wait('button[data-e2e-list-create-button]')
		.click('button[data-e2e-list-create-button]')
		.wait('button.octicon')
		.click('button.octicon')
		.wait('button[type="submit"]')
		.click('button[type="submit"]')
		.wait(500) // this is required to click the following element
		.click('button.octicon')
		.wait(5000) // wait to be sure the component has time to render if its going to render
		.evaluate(function () {
			return !document.querySelectorAll('.Select-control').length;
		})
		.end()
		.then(function (doesNotExist) {
			demand(doesNotExist).to.be.true();
		});
	});
});
