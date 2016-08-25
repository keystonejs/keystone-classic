module.exports = {
	before: function (browser) {
		browser.adminUIApp = browser.page.adminUIApp();
		browser.signinScreen = browser.page.signinScreen();
		browser.listScreen = browser.page.listScreen();
		browser.itemScreen = browser.page.itemScreen();
		browser.initialFormScreen = browser.page.initialForm();

		browser.adminUIApp.gotoHomeScreen();
		browser.adminUIApp.waitForSigninScreen();

		browser.signinScreen.signin();
		browser.adminUIApp.waitForHomeScreen();
	},
	after: function (browser) {
		browser.adminUIApp.signout();
		browser.end();
	},
	'Demonstrate issue 2898': function(browser) {
		// Create items
		browser.adminUIApp.openFieldList('Datetime');
		browser.listScreen.createFirstItem();
		browser.adminUIApp.waitForInitialFormScreen();

		browser.initialFormScreen.fillInputs({
			listName: 'Datetime',
			fields: {
				'name': {value: 'testing'},
				'fieldA': {date: '2016-01-01', time: 'bar'},
			}
		});

		browser.initialFormScreen.save();

		// The following assertion passes where it should fail.
		browser.itemScreen.assertInputs({
			listName: 'Datetime',
			fields: {
				'name': {value: 'testing'},
				'fieldA': {date: '1970-01-01', time: '12:00:00 am'},
			}
		});

		// The following assertion fails where is should pass.
		browser.initialFormScreen.assertFlashError("Please enter a valid date and time in the Field A field");

		browser.initialFormScreen.cancel();

	}
};
