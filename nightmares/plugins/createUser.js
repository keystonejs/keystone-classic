module.exports = function createUser (user) {
	return function (nightmare) {
		return nightmare
		.click('div#react-root > div.css-awku5i:nth-child(1) > main.css-1gs0ko2:nth-child(2) > div.css-1xkojxp:nth-child(1) > div.dashboard-groups:nth-child(2) > div:nth-child(1) > div.dashboard-group:nth-child(1) > div.dashboard-group__lists:nth-child(2) > div.dashboard-group__list:nth-child(1) > span.dashboard-group__list-inner:nth-child(1) > a.dashboard-group__list-tile:nth-child(1) > div.dashboard-group__list-label:nth-child(1)')
		.wait(500)
		.click('[data-e2e-list-create-button]')
		.wait(500)
		.type('[name="name.first"]', user.firstName)
		.type('[name="name.last"]', user.lastName)
		.type('[name="email"]', user.email)
		.type('[name="password"]', user.password)
		.type('[name="password_confirm"]', user.password)
		.click('button[type="submit"]')
		.wait(500);
	};
};
