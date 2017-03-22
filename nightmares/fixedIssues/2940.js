var demand = require('must');
var createNightmare = require('../createNightmare');
var login = require('../plugins/login');
var navigationClick = require('../plugins/navigationClick');
var createUser = require('../plugins/createUser');
var isMongoObjectId = require('../isMongoObjectId');
// ensure the problem still exists https://github.com/keystonejs/keystone/issues/2940
describe('#2940 is Fixed', function () {
	this.timeout(400000);

	it.only('Describe issue', function () {
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
		.type('[name="name"]', 'Issue2940')
		.type('.Select-control input', 'Bob Dylan\u000d')
		.wait('button[type="submit"]')
		.click('button[type="submit"]')
		.wait('.Select-value-label')
		.click('.Select-value-label')
		.wait('li.active[data-list-path="users"]')
		.evaluate(function () {
			return document.location.href;
		})
		.end()
		.then(function (url) {
			demand(url).include('http://localhost:3000/keystone/users/');
			demand(isMongoObjectId(url.split('/')[5])).to.be.true();
		});
	});
});
