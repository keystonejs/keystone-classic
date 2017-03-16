module.exports = function clickNavTab (n) {
	return function (nightmare) {
		return nightmare
		.click('a[href="/keystone/' + n + '"]');
	};
};
