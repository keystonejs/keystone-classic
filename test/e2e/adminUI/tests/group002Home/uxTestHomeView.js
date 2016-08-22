module.exports = {
	before: function (browser) {
		browser.app = browser.page.app();
		browser.signinScreen = browser.page.signin();
		browser.homeScreen = browser.page.home();
		browser.initialFormScreen = browser.page.initialForm();
		browser.listScreen = browser.page.list();
		browser.deleteConfirmationScreen = browser.page.deleteConfirmation();

		browser.app
			.gotoHomeScreen()
			.waitForSigninScreen();

		browser.signinScreen.signin();

		browser.app.waitForHomeScreen();
	},
	after: function (browser) {
		browser.app.signout();
		browser.end();
	},
	'Home view should allow clicking a nav menu item such as Access and Fields to show the list of items': function (browser) {
		browser.app
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
		browser.app
			.gotoHomeScreen()
			.waitForHomeScreen();

		browser.homeScreen.section.accessGroup.section.users
			.click('@label');

		browser.app
			.waitForListScreen();
	},
	'Home view should allow an admin to create a new list item such as a user': function (browser) {
		browser.app
			.gotoHomeScreen()
			.waitForHomeScreen();

		browser.homeScreen.section.accessGroup.section.users
			.click('@plusIconLink');

		browser.initialFormScreen.section.form
			.waitForElementVisible('@createButton');
	},
	'Home view should allow an admin to create a new list item and increment the item count': function (browser) {
		browser.app
			.gotoHomeScreen()
			.waitForHomeScreen();

		browser.homeScreen.section.fieldsGroup.section.names
			.expect.element('@itemCount').text.to.equal('0 Items');
		browser.homeScreen.section.fieldsGroup.section.names
			.click('@plusIconLink');

		browser.initialFormScreen.section.form
			.waitForElementVisible('@createButton');

		browser.initialFormScreen.section.form.section.nameList.section.name
			.fillInput({value: 'Name Field Test'});
		browser.initialFormScreen.section.form.section.nameList.section.fieldA
			.fillInput({firstName: 'First', lastName: 'Last'});

		browser.initialFormScreen.section.form
			.click('@createButton');

		browser.app
			.waitForItemScreen()
			.gotoHomeScreen()
			.waitForHomeScreen();

		browser.homeScreen.section.fieldsGroup.section.names
			.expect.element('@itemCount').text.to.equal('1 Item');
	},
	'Home view should be accessible from any other non-modal view by clicking the Home link': function (browser) {
		browser.app
			.gotoHomeScreen()
			.waitForHomeScreen();

		browser.homeScreen.section.accessGroup.section.users
			.click('@label');
		browser.app
			.waitForListScreen();

		browser.app
			.click('@homeIconLink')
			.waitForHomeScreen();
	},
	// UNDO ANY STATE CHANGES -- THIS TEST SHOULD RUN LAST
	'Home view ... undoing any state changes': function (browser) {
		// Delete the Name Field added
		browser.app
			.gotoHomeScreen()
			.waitForHomeScreen();

		browser.app
			.click('@fieldListsMenu')
			.waitForListScreen();

		browser.app
			.click('@nameListSubmenu')
			.waitForListScreen();

		browser.listScreen
			.click('@singleItemDeleteIcon');

		browser.deleteConfirmationScreen
			.waitForElementVisible('@deleteButton');

		browser.deleteConfirmationScreen
			.click('@deleteButton');

		browser.app.waitForListScreen();
	},
};
