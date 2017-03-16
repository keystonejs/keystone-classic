var demand = require('must');
var createNightmare = require('../createNightmare');
var login = require('../plugins/login');
var navigationClick = require('../plugins/navigationClick');
var createUser = require('../plugins/createUser');

// Closed, ensure its not reproducible https://github.com/keystonejs/keystone/issues/2382
describe('Issue 2382', function () {
	this.timeout(20000);

	it.only('Describe the relationship issue', function () {
		return createNightmare()
		.use(login())
		.use(createUser({
			firstName: 'Bob',
			lastName: 'Dylan',
			email: 'knockknock@onheavens.door.com',
			password: 'knockknock',
		}))
		.use(navigationClick('booleans'))
		.use(navigationClick('relationships'))
		.wait(500)
		.click('button[data-e2e-list-create-button]')
		.type('[name="name"]', 'Issue2382')
		.type('.Select-control input', 'Bob Dylan\u000d')
		.click('button[type="submit"]')
	});
});
