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
	'Demonstrate issue 2898': function(browser) {
		// Create items
		browser.app.openFieldList('Datetime');
		browser.listPage.createFirstItem();
		browser.app.waitForInitialFormScreen();

		browser.initialFormPage.fillInputs({
			listName: 'Datetime',
			fields: {
				'name': {value: 'testing'},
				'fieldA': {date: '2016-01-01', time: 'bar'},
			}
		});

		browser.initialFormPage.save();

		// The following assertion passes where it should fail.
		browser.itemPage.assertInputs({
			listName: 'Datetime',
			fields: {
				'name': {value: 'testing'},
				'fieldA': {date: '1970-01-01', time: '12:00:00 am'},
			}
		});

		// The following assertion fails where is should pass.
		browser.initialFormPage.assertFlashError("Please enter a valid date and time in the Field A field");

		browser.initialFormPage.cancel();

	}
};
