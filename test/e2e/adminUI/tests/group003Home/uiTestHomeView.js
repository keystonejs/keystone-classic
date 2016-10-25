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
		// TODO: implement the 'e2e' text assertion
		browser.adminUIHomeScreen.assertElementIsVisible({ element: 'dashboardHeader' });
	},
	'Home view should have an Access group with the specified tabs configuration': function (browser) {
		browser.adminUIHomeScreen.assertTabUIVisible({
			groupName: 'Access',
			tabs: [
				{ listName: 'User', items: '2 Items' },
			],
		});
	},
	'Home view should have a Fields group with the specified tabs configuration': function (browser) {
		browser.adminUIHomeScreen.assertTabUIVisible({
			groupName: 'Fields',
			tabs: [
				{ listName: 'Boolean', items: '0 Items' },
				{ listName: 'Code', items: '0 Items' },
				{ listName: 'Email', items: '0 Items' },
				{ listName: 'Name', items: '0 Items' },
				{ listName: 'Number', items: '0 Items' },
				{ listName: 'Select', items: '0 Items' },
			],
		});
	},
	'Home view should have an Other group with the specified tabs configuration': function (browser) {
		browser.adminUIHomeScreen.assertTabUIVisible({
			groupName: 'Other',
			tabs: [
				{ listName: 'OtherList', items: '0 Items' },
			],
		});
	},
};
