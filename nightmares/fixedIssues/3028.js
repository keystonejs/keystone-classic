var demand = require('must');
var createNightmare = require('../createNightmare');
var login = require('../plugins/login');
var navigationClick = require('../plugins/navigationClick');
var createUser = require('../plugins/createUser');

// ensure the problem still exists https://github.com/keystonejs/keystone/issues/3028
describe('#3028 is Fixed', function () {
	this.timeout(400000);

	it.only('Describe issue', function () {
		return createNightmare()
		.use(login())
		.use(createUser({
			firstName: 'Brian',
			lastName: 'Conolly',
			email: 'dangerous@brian.com',
			password: 'itsapuppet!',
		}))
		.use(navigationClick('date-field-maps'))
		.use(navigationClick('inline-relationships'))
		.wait('button[data-e2e-list-create-button]')
		.click('button[data-e2e-list-create-button]')
		.wait('button[type="submit"]')
		.click('button[type="submit"]')
		.wait('.Select-control input')
		.type('.Select-control input', 'Brian Conolly\u000d')
		.click('button[data-button="update"]')
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
