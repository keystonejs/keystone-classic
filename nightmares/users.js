var createNightmare = require('./createNightmare');
var demand = require('must');
var login = require('./plugins/login');

var re = /^[0-9a-fA-F]{24}$/;
function isMongoObjectId (str) {
	if (str && typeof str !== 'string' && str.toString) {
		str = str.toString();
	}

	return str && re.test(str);
};

describe('App', function () {
	this.timeout(10000);

	it('Should show a list of users in a table', function () {
		return createNightmare()
		.use(login())
		// click users get selectors easily using the chrome extension
		.click('div#react-root > div.css-awku5i:nth-child(1) > main.css-1gs0ko2:nth-child(2) > div.css-1xkojxp:nth-child(1) > div.dashboard-groups:nth-child(2) > div:nth-child(1) > div.dashboard-group:nth-child(1) > div.dashboard-group__lists:nth-child(2) > div.dashboard-group__list:nth-child(1) > span.dashboard-group__list-inner:nth-child(1) > a.dashboard-group__list-tile:nth-child(1) > div.dashboard-group__list-label:nth-child(1)')
		.wait(500)
		.evaluate(function () {
			return document.querySelectorAll('tr').length;
		})
		.end()
		.then(function (result) {
			var numberOfTableRows = 3; // this includes the table header so 2 users
			demand(result).to.equal(numberOfTableRows);
		});
	});

	it('Should add a new user', function () {
		this.timeout(20000);

		return createNightmare()
		.use(login())
		// click users get selectors easily using the chrome extension
		.click('div#react-root > div.css-awku5i:nth-child(1) > main.css-1gs0ko2:nth-child(2) > div.css-1xkojxp:nth-child(1) > div.dashboard-groups:nth-child(2) > div:nth-child(1) > div.dashboard-group:nth-child(1) > div.dashboard-group__lists:nth-child(2) > div.dashboard-group__list:nth-child(1) > span.dashboard-group__list-inner:nth-child(1) > a.dashboard-group__list-tile:nth-child(1) > div.dashboard-group__list-label:nth-child(1)')
		.wait(500)
		.click('[data-e2e-list-create-button]')
		.wait(500)
		.type('[name="name.first"]', 'bob')
		.type('[name="name.last"]', 'marley')
		.type('[name="email"]', 'marley@music.com')
		.type('[name="password"]', 'password123')
		.type('[name="password_confirm"]', 'password123')
		.click('button[type="submit"]')
		.wait(500)
		.evaluate(function () {
			return document.location.href;
		})
		.end()
		.then(function (url) {
			demand(url).include('http://localhost:3000/keystone/users/');
			demand(isMongoObjectId(url.split('/')[5])).to.be.true();
		});
	});

	it('Should delete a user', function () {
		this.timeout(20000);

		return createNightmare()
		.use(login())
		// click users get selectors easily using the chrome extension
		.click('div#react-root > div.css-awku5i:nth-child(1) > main.css-1gs0ko2:nth-child(2) > div.css-1xkojxp:nth-child(1) > div.dashboard-groups:nth-child(2) > div:nth-child(1) > div.dashboard-group:nth-child(1) > div.dashboard-group__lists:nth-child(2) > div.dashboard-group__list:nth-child(1) > span.dashboard-group__list-inner:nth-child(1) > a.dashboard-group__list-tile:nth-child(1) > div.dashboard-group__list-label:nth-child(1)')
		.wait(500)
		.click('div#react-root > div.css-awku5i:nth-child(1) > main.css-1gs0ko2:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div.css-1xkojxp:nth-child(3) > div:nth-child(1) > div.ItemList-wrapper:nth-child(1) > table.Table.ItemList:nth-child(1) > tbody:nth-child(3) > tr:nth-child(1) > td.ItemList__col--control.ItemList__col--delete:nth-child(1) > button.ItemList__control.ItemList__control--delete:nth-child(1) > span.octicon.octicon-trashcan:nth-child(1)')
		.click('html > body > div:nth-child(14) > div:nth-child(1) > div:nth-child(2) > div.css-z5zujf:nth-child(1) > div.css-1mzpobk:nth-child(1) > div.css-2dhvf4:nth-child(2) > button.css-t4884:nth-child(1)')
		.wait(500)
		.evaluate(function () {
			return document.querySelectorAll('tr').length;
		})
		.end()
		.then(function (result) {
			var numberOfTableRows = 3; // this includes the table header so 2 users after delete
			demand(result).to.equal(numberOfTableRows);
		});
	});
	it('E2e Member is not an Admin', function () {
		this.timeout(20000);

		return createNightmare()
		.use(login())
		// click users get selectors easily using the chrome extension
		.goto('http://localhost:3000/keystone/users')
		.wait(500)
		.evaluate(function () {
			return !!document.querySelector('tbody tr:nth-child(1) .ItemList__col:nth-child(4) .ItemList__value .octicon-x');
		})
		.end()
		.then(function (isNotAdmin) {
			demand(isNotAdmin).to.equal(true);
		});
	});
});
