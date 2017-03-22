var demand = require('must');
var createNightmare = require('../createNightmare');
var login = require('../plugins/login');
var navigationClick = require('../plugins/navigationClick');
// ensure the problem still exists https://github.com/keystonejs/keystone/issues/2892
describe('#2892 is Fixed', function () {
	this.timeout(400000);

	it.only('Describe issue', function () {
		return createNightmare()
		.use(login())
		.use(navigationClick('datetimes'))
		.wait('button[data-e2e-list-create-button]')
		.click('button[data-e2e-list-create-button]')
		.type('[name="name"]', 'Testing2892')
		.type('[name="fieldA_date"]', '2016-01-01')
		.type('[name="fieldA_time"]', 'bar')
		.click('button[type="submit"]')
		.wait('div[data-alert-type="danger"] div')
		.evaluate(function () {
			return document.querySelector('div[data-alert-type="danger"] div').innerText;
		})
		.end()
		.then(function (errorMessage) {
			demand(errorMessage).to.equal('FieldA is invalid');
		});
	});
});
