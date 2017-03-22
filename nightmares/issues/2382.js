var demand = require('must');
var createNightmare = require('../createNightmare');
var login = require('../plugins/login');
var navigationClick = require('../plugins/navigationClick');
var createUser = require('../plugins/createUser');
// Closed, ensure the problem no longer exists https://github.com/keystonejs/keystone/issues/2382
describe('Issue 2382 is Fixed', function () {
	this.timeout(400000);

	it('Describe the relationship issue', function () {
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
		.wait('button[data-e2e-list-create-button]')
		.click('button[data-e2e-list-create-button]')
		.type('[name="name"]', 'Issue2382')
		.type('.Select-control input', 'Bob Dylan\u000d')
		.wait('button[type="submit"]')
		.click('button[type="submit"]')
		.use(navigationClick('users'))
		// // DELETE USER
		.wait('.octicon.octicon-trashcan')
		.click('.octicon.octicon-trashcan')
		.wait('.octicon.octicon-trashcan')
		.click('button[data-button-type="confirm"]')
		.use(navigationClick('booleans'))
		.use(navigationClick('relationships'))
		.wait('.ItemList__value')
		.click('.ItemList__value')
		.wait('.Select-control')
		.evaluate(function () {
			return document.querySelector('.Select-control .Select-value-label').innerText;
		})
		.end()
		.then(function (label) {
			demand(label).to.equal('');
		});
	});
});
