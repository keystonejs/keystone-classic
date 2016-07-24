module.exports = {
	before: function (browser) {
		browser.app = browser.page.app();
		browser.signinPage = browser.page.signin();
		browser.listPage = browser.page.list();
		browser.itemPage = browser.page.item();
		browser.initialFormPage = browser.page.initialForm();
		browser.deleteConfirmation = browser.page.deleteConfirmation();

		browser.app.navigate();
		browser.app.waitForSigninScreen();

		browser.signinPage.signin();
		browser.app.waitForElementVisible('@homeScreen');
	},
	after: function (browser) {
		browser.app.signout();
		browser.end();
	},
	'Demonstrate issue 3126': function(browser) {

		// Add new text item

		browser.app.openMiscList('DateFieldMap');
		browser.listPage.createFirstItem();
		browser.app.waitForInitialFormScreen();

		browser.initialFormPage.fillInputs({
			listName: 'DateFieldMap',
			fields: {
				'datefield': {value: '2016-01-01'},
			}
		});
		browser.initialFormPage.save();
		browser.app.waitForItemScreen();

		browser.itemPage.back();


		// The following command fails, because there is no link to follow. This is a bug. 
		// If you remove the map from test/e2e/models/misc/DateFieldMap.js then the command works.
		browser.listPage.navigateToFirstItem();

	}
};
