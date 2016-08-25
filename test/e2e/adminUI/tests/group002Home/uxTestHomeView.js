var NameModelTestConfig = require('../../../modelTestConfig/NameModelTestConfig');

module.exports = {
	before: function (browser) {
		browser.adminUIApp = browser.page.adminUIApp();
		browser.signinScreen = browser.page.signinScreen();
		browser.homeScreen = browser.page.homeScreen();
		browser.initialFormScreen = browser.page.initialForm();
		browser.listScreen = browser.page.listScreen();
		browser.deleteConfirmationScreen = browser.page.deleteConfirmation();

		browser.adminUIApp
			.gotoHomeScreen()
			.waitForSigninScreen();

		browser.signinScreen.signin();

		browser.adminUIApp.waitForHomeScreen();
	},
	after: function (browser) {
		browser.adminUIApp.signout();
		browser.end();
	},
	'Home view should allow clicking a nav menu item such as Access and Fields to show the list of items': function (browser) {
		browser.adminUIApp
			.gotoHomeScreen()
			.waitForHomeScreen()
			.click('@accessMenu')
			.waitForListScreen()
			.gotoHomeScreen()
			.waitForHomeScreen()
			.click('@fieldListsMenu')
			.waitForListScreen();
	},
	'Home view should allow clicking a card list item such as Users to should show the list of those items': function (browser) {
		browser.adminUIApp
			.gotoHomeScreen()
			.waitForHomeScreen();

		browser.homeScreen.section.accessGroup.section.users
			.click('@label');

		browser.adminUIApp
			.waitForListScreen();
	},
	'Home view should allow an admin to create a new list item such as a user': function (browser) {
		browser.adminUIApp
			.gotoHomeScreen()
			.waitForHomeScreen();

		browser.homeScreen.section.accessGroup.section.users
			.click('@plusIconLink');

		browser.initialFormScreen.section.form
			.waitForElementVisible('@createButton');
	},
	'Home view should allow an admin to create a new list item and increment the item count': function (browser) {
		browser.adminUIApp
			.gotoHomeScreen()
			.waitForHomeScreen();

		browser.homeScreen.section.fieldsGroup.section.names
			.expect.element('@itemCount').text.to.equal('0 Items');
		browser.homeScreen.section.fieldsGroup.section.names
			.click('@plusIconLink');

		browser.adminUIApp.waitForInitialFormScreen();

		browser.initialFormScreen.fillInputs({
			modelTestConfig: NameModelTestConfig,
			fields: {
				'name': {value: 'Name Field Test'},
				'fieldA': {firstName: 'First', lastName: 'Last'},
			}
		});

		browser.initialFormScreen.save();

		browser.adminUIApp
			.waitForItemScreen()
			.gotoHomeScreen()
			.waitForHomeScreen();

		browser.homeScreen.section.fieldsGroup.section.names
			.expect.element('@itemCount').text.to.equal('1 Item');
	},
	'Home view should be accessible from any other non-modal view by clicking the Home link': function (browser) {
		browser.adminUIApp
			.gotoHomeScreen()
			.waitForHomeScreen();

		browser.homeScreen.section.accessGroup.section.users
			.click('@label');
		browser.adminUIApp
			.waitForListScreen();

		browser.adminUIApp
			.click('@homeIconLink')
			.waitForHomeScreen();
	},
	// UNDO ANY STATE CHANGES -- THIS TEST SHOULD RUN LAST
	'Home view ... undoing any state changes': function (browser) {
		// Delete the Name Field added
		browser.adminUIApp
			.gotoHomeScreen()
			.waitForHomeScreen();

		browser.adminUIApp
			.click('@fieldListsMenu')
			.waitForListScreen();

		browser.adminUIApp
			.click('@nameListSubmenu')
			.waitForListScreen();

		browser.listScreen
			.click('@singleItemDeleteIcon');

		browser.deleteConfirmationScreen
			.waitForElementVisible('@deleteButton');

		browser.deleteConfirmationScreen
			.click('@deleteButton');

		browser.adminUIApp.waitForListScreen();
	},
};
