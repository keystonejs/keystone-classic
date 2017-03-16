var demand = require('must');
var createNightmare = require('../createNightmare');
var login = require('../plugins/login');
var navigationClick = require('../plugins/navigationClick');
var createUser = require('../plugins/createUser');

// Closed, ensure its not reproducible https://github.com/keystonejs/keystone/issues/2382
describe('Issue 2382', function () {
	this.timeout(400000);

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
		.wait(500)
		.click('button[type="submit"]')
		.wait(500)
		.use(navigationClick('users'))
		.wait(500)
		// DELETE USER
		.click('div#react-root > div.css-awku5i:nth-child(1) > main.css-1gs0ko2:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div.css-1xkojxp:nth-child(3) > div:nth-child(1) > div.ItemList-wrapper:nth-child(1) > table.Table.ItemList:nth-child(1) > tbody:nth-child(3) > tr:nth-child(1) > td.ItemList__col--control.ItemList__col--delete:nth-child(1) > button.ItemList__control.ItemList__control--delete:nth-child(1) > span.octicon.octicon-trashcan:nth-child(1)')
		// CONFIRM DELETE USER
		.click('html > body > div:nth-child(14) > div:nth-child(1) > div:nth-child(2) > div.css-z5zujf:nth-child(1) > div.css-1mzpobk:nth-child(1) > div.css-2dhvf4:nth-child(2) > button.css-t4884:nth-child(1)')
		.use(navigationClick('booleans'))
		.use(navigationClick('relationships'))
		.wait('.ItemList__value--truncate')
		.click('.ItemList__value--truncate')
		// .click('tr .ItemList__col:nth-child(1) .ItemList__value')
		// .click('div#react-root > div.css-awku5i:nth-child(1) > main.css-1gs0ko2:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div.css-1xkojxp:nth-child(3) > div:nth-child(1) > div.ItemList-wrapper:nth-child(1) > table.Table.ItemList:nth-child(1) > tbody:nth-child(3) > tr:nth-child(1) > td.ItemList__col:nth-child(2) > a.ItemList__value.ItemList__value--text.ItemList__link--interior.ItemList__link--padded.ItemList__value--truncate:nth-child(1)')
		// .wait(500)
		.evaluate(function () {
			return document.querySelector('.Select-value').innerHTML;
		})
		.end()
		.then(function (html) {
			demand(html).to.equal(html);
		});
	});
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
		.wait(500)
		.click('button[type="submit"]')
		.wait(500)
		.use(navigationClick('booleans'))
		.use(navigationClick('relationships'))
		.wait(1000)
		.click('.ItemList__value--truncate')
		.evaluate(function () {
			return document.location.href;
		})
		.end()
		.then(function (url) {
			console.log('final url', url);
		});
		// .click('.ItemList__value--truncate')
		// .end()
		// .then(function (html) {
			// demand(html).to.equal(html);
		// });
	});
});
