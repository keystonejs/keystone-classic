module.exports = {
	before: function (browser) {
		browser.app = browser.page.app();
		browser.signinScreen = browser.page.signin();
		browser.listScreen = browser.page.list();
		browser.itemScreen = browser.page.item();
		browser.initialFormScreen = browser.page.initialForm();
		browser.deleteConfirmationScreen = browser.page.deleteConfirmation();

		browser.app.gotoHomeScreen();
		browser.app.waitForSigninScreen();

		browser.signinScreen.signin();
		browser.app.waitForHomeScreen();
	},
	after: function (browser) {
		browser.app.signout();
		browser.end();
	},
	'Demonstrate issue 3126': function(browser) {

		// Add new text item

		browser.app.openMiscList('DateFieldMap');
		browser.listScreen.createFirstItem();
		browser.app.waitForInitialFormScreen();

		browser.initialFormScreen.fillInputs({
			listName: 'DateFieldMap',
			fields: {
				'datefield': {value: '2016-01-01'},
			}
		});
		browser.initialFormScreen.save();
		browser.app.waitForItemScreen();

		browser.itemScreen.back();


		// The following command fails, because there is no link to follow. This is a bug. 
		// If you remove the map from test/e2e/models/misc/DateFieldMap.js then the command works.
		browser.listScreen.navigateToFirstItem();

	}
};
