var demand = require('must');
var createNightmare = require('../createNightmare');
var login = require('../plugins/login');
var navigationClick = require('../plugins/navigationClick');
var createUser = require('../plugins/createUser');
var isMongoObjectId = require('../isMongoObjectId');

// ensure the problem still exists https://github.com/keystonejs/keystone/issues/3126
describe('#3126 is Fixed', function () {
	this.timeout(400000);

	it('Describe issue', function () {
		return createNightmare()
		.use(login())
		.use(createUser({
			firstName: 'Brian',
			lastName: 'Conolly',
			email: 'dangerous@brian.com',
			password: 'itsapuppet!',
		}))
		.use(navigationClick('date-field-maps'))
		.wait('button[data-e2e-list-create-button]')
		.click('button[data-e2e-list-create-button]')
		.type('input', '1990-10-16')
		.wait('button[type="submit"]')
		.click('button[type="submit"]')
		.wait('a[data-e2e-editform-header-back="true"]')
		.click('a[data-e2e-editform-header-back="true"]')
		.wait('.ItemList__value')
		.click('.ItemList__value')
		.evaluate(function () {
			return document.location.href;
		})
		.end()
		.then(function (url) {
			demand(url).include('http://localhost:3000/keystone/date-field-maps/');
			demand(isMongoObjectId(url.split('/')[5])).to.be.true();
		});
	});
});
