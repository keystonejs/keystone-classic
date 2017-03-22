var demand = require('must');
var createNightmare = require('../createNightmare');
var login = require('../plugins/login');
var navigationClick = require('../plugins/navigationClick');

// ensure the problem still exists https://github.com/keystonejs/keystone/issues/2945
describe('#2945 is Fixed', function () {
	this.timeout(400000);

	it('Describe issue', function () {
		return createNightmare()
		.use(login())
		.use(navigationClick('date-field-maps'))
		.use(navigationClick('no-default-columns'))
		.wait('button[data-e2e-list-create-button]')
		.click('button[data-e2e-list-create-button]')
		.type('[name="fieldA"]', 'testing')
		.wait('button[type="submit"]')
		.click('button[type="submit"]')
		.wait('a[data-e2e-editform-header-back="true"]')
		.click('a[data-e2e-editform-header-back="true"]')
		.wait('.ItemList__col')
		.evaluate(function () {
			return document.querySelectorAll('.ItemList__col').length;
		})
		.end()
		.then(function (rowCount) {
			demand(rowCount).to.be.equal(1);
		});
	});
});
