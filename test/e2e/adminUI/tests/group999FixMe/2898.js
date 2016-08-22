module.exports = {
	before: function (browser) {
		browser.app = browser.page.app();
		browser.signinScreen = browser.page.signin();
		browser.listScreen = browser.page.list();
		browser.itemScreen = browser.page.item();
		browser.initialFormScreen = browser.page.initialForm();

		browser.app.gotoHomeScreen();
		browser.app.waitForSigninScreen();

		browser.signinScreen.signin();
		browser.app.waitForHomeScreen();
	},
	after: function (browser) {
		browser.app.signout();
		browser.end();
	},
	'Demonstrate issue 2898': function(browser) {
		// Create items
		browser.app.openFieldList('Datetime');
		browser.listScreen.createFirstItem();
		browser.app.waitForInitialFormScreen();

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
