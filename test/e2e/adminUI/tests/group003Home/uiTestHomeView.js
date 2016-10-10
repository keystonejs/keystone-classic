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
			name: 'Access',
			tabs: [
				{ list: 'User', items: '2 Items' },
			],
		});
	},
	'Home view should have a Fields group with the specified tabs configuration': function (browser) {
		browser.adminUIHomeScreen.assertTabUIVisible({
			name: 'Fields',
			tabs: [
				{ list: 'Boolean', items: '0 Items' },
				{ list: 'Code', items: '0 Items' },
				{ list: 'Email', items: '0 Items' },
				{ list: 'Name', items: '0 Items' },
				{ list: 'Number', items: '0 Items' },
				{ list: 'Select', items: '0 Items' },
			],
		});
	},
	'Home view should have an Other group with the specified tabs configuration': function (browser) {
		browser.adminUIHomeScreen.assertTabUIVisible({
			name: 'Other',
			tabs: [
				{ list: 'OtherList', items: '0 Items' },
			],
		});
	},
};
