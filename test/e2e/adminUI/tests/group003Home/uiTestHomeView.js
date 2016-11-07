module.exports = {
	before: function (browser) {
		browser.adminUIApp = browser.page.adminUIApp();
		browser.adminUISigninScreen = browser.page.adminUISignin();
		browser.adminUIHomeScreen = browser.page.adminUIHomeScreen();

		browser.adminUIApp.gotoSigninScreen();
		browser.adminUISigninScreen.signin();
	},
	after: function (browser) {
		browser.adminUIApp.signout();
		browser.end();
	},
	'Home view should have a dashboard header': function (browser) {
		browser.adminUIHomeScreen.assertElementIsVisible({ element: '@dashboardHeader' });
		browser.adminUIHomeScreen.assertElementTextEquals({ element: '@dashboardHeader', text: 'e2e' });
	},
	'Home view should have an Access group with the specified tabs configuration': function (browser) {
		browser.adminUIHomeScreen
			.configureTabUI({
				groupName: 'Access',
				tabs: [
					{ listName: 'User', items: '2 Items' },
				],
			})
			.assertTabUIVisible({ groupName: 'Access' });
	},
	'Home view should have a Fields group with the specified tabs configuration': function (browser) {
		browser.adminUIHomeScreen
			.configureTabUI({
				groupName: 'Fields',
				tabs: [
					{ listName: 'Boolean', items: '0 Items' },
					{ listName: 'Code', items: '0 Items' },
					{ listName: 'Email', items: '0 Items' },
					{ listName: 'Name', items: '0 Items' },
					{ listName: 'Number', items: '0 Items' },
					{ listName: 'Select', items: '0 Items' },
				],
			})
			.assertTabUIVisible({ groupName: 'Fields' });
	},
	'Home view should have an Other group with the specified tabs configuration': function (browser) {
		browser.adminUIHomeScreen
			.configureTabUI({
				groupName: 'Other',
				tabs: [
					{ listName: 'OtherList', items: '0 Items' },
				],
			})
			.assertTabUIVisible({ groupName: 'Other' });
	},
};
