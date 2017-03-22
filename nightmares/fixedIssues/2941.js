var demand = require('must');
var createNightmare = require('../createNightmare');
var login = require('../plugins/login');
var navigationClick = require('../plugins/navigationClick');
var createUser = require('../plugins/createUser');

// ensure the problem still exists https://github.com/keystonejs/keystone/issues/2941
describe('#2941 is Fixed', function () {
	this.timeout(400000);

	it('Describe issue', function () {
		return createNightmare()
		.use(login())
		.use(createUser({
			firstName: 'Bob',
			lastName: 'Dylan',
			email: 'knockknock@onheavens.door.com',
			password: 'knockknock',
		}))
		.use(navigationClick('date-field-maps'))
		.use(navigationClick('hidden-relationships'))
		.wait('button[data-e2e-list-create-button]')
		.click('button[data-e2e-list-create-button]')
		.wait('.Select-control input')
		.type('.Select-control input', 'Bob Dylan\u000d')
		.wait('button[type="submit"]')
		.click('button[type="submit"]')
		.wait('button[data-button="delete"]')
		.evaluate(function () {
			return !document.querySelector('input');
		})
		.end()
		.then(function (noEditFieldsPresent) {
			demand(noEditFieldsPresent).to.be.true();
		});
	});
});
