module.exports = function login (user) {
	user = user || {
		email: 'user@test.e2e',
		password: 'test',
	};

	return function (nightmare) {
		return nightmare
		.goto('http://localhost:3000/')
		.click('html.no-js > body > a:nth-child(3) > h3:nth-child(1)')
		.type('input[name="email"]', user.email)
		.type('input[name="password"]', user.password)
		.click('button[type="submit"]')
		.wait(500);
	};
};
