var NameModelTestConfig = require('../../../modelTestConfig/NameModelTestConfig');

module.exports = {
	before: function (browser) {
		browser.adminUIApp = browser.page.adminUIApp();
		browser.adminUISigninScreen = browser.page.adminUISignin();
		browser.adminUIHomeScreen = browser.page.adminUIHomeScreen();
		browser.adminUIInitialFormScreen = browser.page.adminUIInitialForm();
		browser.adminUIListScreen = browser.page.adminUIListScreen();
		browser.adminUIDeleteConfirmation = browser.page.adminUIDeleteConfirmation();

		browser.adminUIApp.gotoHomeScreen();
		browser.adminUIApp.waitForSigninScreen();

		browser.adminUISigninScreen.signin();

		browser.adminUIApp.waitForHomeScreen();
	},
	after: function (browser) {
		browser.adminUIApp.signout();
		browser.end();
	},
	'Home view should allow clicking a nav menu item such as Access and Fields to show the list of items': function (browser) {
		browser.adminUIApp
			.waitForHomeScreen()
			.click('@accessMenu')
			.waitForListScreen();
		browser.adminUIApp.gotoHomeScreen();
		browser.adminUIApp.waitForHomeScreen()
			.click('@fieldListsMenu')
			.waitForListScreen();
	},
	'Home view should allow clicking a card list item such as Users to should show the list of those items': function (browser) {
		browser.adminUIApp.gotoHomeScreen();
		browser.adminUIApp.waitForHomeScreen();

		browser.adminUIHomeScreen.section.accessGroup.section.users
			.click('@label');

		browser.adminUIApp
			.waitForListScreen();
	},
	'Home view should allow an admin to create a new list item such as a user': function (browser) {
		browser.adminUIApp.gotoHomeScreen();
		browser.adminUIApp.waitForHomeScreen();

		browser.adminUIHomeScreen.section.accessGroup.section.users
			.click('@plusIconLink');

		browser.adminUIInitialFormScreen.section.form
			.waitForElementVisible('@createButton');
	},
	'Home view should allow an admin to create a new list item and increment the item count': function (browser) {
		browser.adminUIApp.gotoHomeScreen();
		browser.adminUIApp.waitForHomeScreen();

		browser.adminUIHomeScreen.section.fieldsGroup.section.names
			.expect.element('@itemCount').text.to.equal('0 Items');
		browser.adminUIHomeScreen.section.fieldsGroup.section.names
			.click('@plusIconLink');

		browser.adminUIApp.waitForInitialFormScreen();

		browser.adminUIInitialFormScreen.fillFieldInputs([
			{name: 'name', input: { value: 'Name Field Test' }, modelTestConfig: NameModelTestConfig,},
			{name: 'fieldA', input: { firstName: 'First', lastName: 'Last' }, modelTestConfig: NameModelTestConfig,},
		]);

		browser.adminUIInitialFormScreen.save();

		browser.adminUIApp.waitForItemScreen();
		browser.adminUIApp.gotoHomeScreen();
		browser.adminUIApp.waitForHomeScreen();

		browser.adminUIHomeScreen.section.fieldsGroup.section.names
			.expect.element('@itemCount').text.to.equal('1 Item');
	},
	'Home view should be accessible from any other non-modal view by clicking the Home link': function (browser) {
		browser.adminUIApp.gotoHomeScreen();
		browser.adminUIApp.waitForHomeScreen();

		browser.adminUIHomeScreen.section.accessGroup.section.users
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
		browser.adminUIApp.gotoHomeScreen();
		browser.adminUIApp.waitForHomeScreen();

		browser.adminUIApp
			.click('@fieldListsMenu')
			.waitForListScreen();

		browser.adminUIApp
			.click('@nameListSubmenu')
			.waitForListScreen();

		browser.adminUIListScreen
			.click('@singleItemDeleteIcon');

		browser.adminUIDeleteConfirmation
			.waitForElementVisible('@deleteButton');

		browser.adminUIDeleteConfirmation
			.click('@deleteButton');

		browser.adminUIApp.waitForListScreen();
	},
};
