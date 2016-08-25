module.exports = {
	before: function (browser) {
		browser.adminUIApp = browser.page.adminUIApp();
		browser.signinScreen = browser.page.signinScreen();
		browser.listScreen = browser.page.listScreen();
		browser.itemScreen = browser.page.itemScreen();
		browser.initialFormScreen = browser.page.initialForm();
		browser.deleteConfirmationScreen = browser.page.deleteConfirmation();

		browser.adminUIApp.gotoHomeScreen();
		browser.adminUIApp.waitForSigninScreen();

		browser.signinScreen.signin();
		browser.adminUIApp.waitForHomeScreen();
	},
	after: function (browser) {
		browser.adminUIApp.signout();
		browser.end();
	},
	'Demonstrate issue 3126': function(browser) {

		// Add new text item

		browser.adminUIApp.openMiscList('DateFieldMap');
		browser.listScreen.createFirstItem();
		browser.adminUIApp.waitForInitialFormScreen();

		browser.initialFormScreen.fillInputs({
			listName: 'DateFieldMap',
			fields: {
				'datefield': {value: '2016-01-01'},
			}
		});
		browser.initialFormScreen.save();
		browser.adminUIApp.waitForItemScreen();

		browser.itemScreen.back();


		// The following command fails, because there is no link to follow. This is a bug. 
		// If you remove the map from test/e2e/models/misc/DateFieldMap.js then the command works.
		browser.listScreen.navigateToFirstItem();

	}
};
