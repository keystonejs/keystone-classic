module.exports = function clickNavTab (n) {
	return function (nightmare) {
		const selector = 'a[href="/keystone/' + n + '"]';
		return nightmare
		.wait(500) // test fails users page fails to render, unknown error
		.click(selector);
	};
};
