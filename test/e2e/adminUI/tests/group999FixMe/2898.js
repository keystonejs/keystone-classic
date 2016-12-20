module.exports = {
	before: function (browser) {
		browser.adminUIApp = browser.page.adminUIApp();
		browser.adminUISigninScreen = browser.page.adminUISignin();
		browser.adminUIListScreen = browser.page.adminUIListScreen();
		browser.adminUIItemScreen = browser.page.adminUIItemScreen();
		browser.adminUIInitialFormScreen = browser.page.adminUIInitialForm();

		browser.adminUIApp.gotoHomeScreen();
		browser.adminUIApp.waitForSigninScreen();

		browser.adminUISigninScreen.signin();
		browser.adminUIApp.waitForHomeScreen();
	},
	after: function (browser) {
		browser.adminUIApp.signout();
		browser.end();
	},
	'Demonstrate issue 2898': function(browser) {
		// Create items
		browser.adminUIApp.openList({section: 'fields', list: 'Datetime'});
		browser.adminUIListScreen.createFirstItem();
		browser.adminUIApp.waitForInitialFormScreen();

		browser.adminUIInitialFormScreen.fillFieldInputs({
			listName: 'Datetime',
			fields: {
				'name': {value: 'testing'},
				'fieldA': {date: '2016-01-01', time: 'bar'},
			}
		});

		browser.adminUIInitialFormScreen.save();

		// The following assertion passes where it should fail.
		browser.adminUIItemScreen.assertFieldInputs({
			listName: 'Datetime',
			fields: {
				'name': {value: 'testing'},
				'fieldA': {date: '1970-01-01', time: '12:00:00 am'},
			}
		});

		// The following assertion fails where is should pass.
		browser.adminUIInitialFormScreen.assertFlashError("Please enter a valid date and time in the Field A field");

		browser.adminUIInitialFormScreen.cancel();

	}
};
