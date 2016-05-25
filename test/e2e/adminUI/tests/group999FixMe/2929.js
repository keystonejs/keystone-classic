module.exports = {
	before: function (browser) {
		browser.app = browser.page.app();
		browser.signinPage = browser.page.signin();
		browser.listPage = browser.page.list();
		browser.itemPage = browser.page.item();
		browser.initialFormPage = browser.page.initialForm();

		browser.app.navigate();
		browser.app.waitForElementVisible('@signinScreen');

		browser.signinPage.signin();
		browser.app.waitForElementVisible('@homeScreen');
	},
	after: function (browser) {
		browser.app.signout();
		browser.end();
	},
	'Demonstrate issue 2929': function(browser) {
		// Create items
		browser.app.openMiscList('DependsOn');
		browser.listPage.createFirstItem();
		browser.app.waitForInitialFormScreen();

		
		// Issue demonstration - the dependency condition is met, so the dependent field should show.

		browser.initialFormPage.assertUI({
			listName: 'DependsOn',
			fields: ['dependent'],
			args: {'editForm': false}
		});

		browser.initialFormPage.cancel();

	}
};
