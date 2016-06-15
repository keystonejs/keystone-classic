module.exports = {
	before: function (browser) {
		browser.app = browser.page.app();
		browser.signinScreen = browser.page.signin();
		browser.homeScreen = browser.page.home();
		browser.initialForm = browser.page.initialForm();
		browser.listScreen = browser.page.list();
		browser.deleteConfirmation = browser.page.deleteConfirmation();

		browser.app.navigate();
		browser.app.waitForElementVisible('@signinScreen');

		browser.signinScreen.signin();
		browser.app.waitForElementVisible('@homeScreen');
	},
	after: function (browser) {
		browser.app.signout();
		browser.end();
	},
	'Home view should allow clicking a nav menu item such as Access and Fields to show the list of items': function (browser) {
		browser.app
			.navigate()
			.waitForElementVisible('@homeScreen')
			.click('@accessMenu')
			.waitForElementVisible('@listScreen')
			.navigate()
			.waitForElementVisible('@homeScreen')
			.click('@fieldListsMenu')
			.waitForElementVisible('@listScreen');
	},
	'Home view should allow clicking a card list item such as Users to should show the list of those items': function (browser) {
		browser.app
			.navigate()
			.waitForElementVisible('@homeScreen');

		browser.homeScreen.section.accessGroup.section.users
			.click('@label');

		browser.app
			.waitForElementVisible('@listScreen');
	},
	'Home view should allow an admin to create a new list item such as a user': function (browser) {
		browser.app
			.navigate()
			.waitForElementVisible('@homeScreen');

		browser.homeScreen.section.accessGroup.section.users
			.click('@plusIconLink');

		browser.initialForm.section.form
			.waitForElementVisible('@createButton');
	},
	'Home view should allow an admin to create a new list item and increment the item count': function (browser) {
		browser.app
			.navigate()
			.waitForElementVisible('@homeScreen');

		browser.homeScreen.section.fieldsGroup.section.names
			.expect.element('@itemCount').text.to.equal('0 Items');
		browser.homeScreen.section.fieldsGroup.section.names
			.click('@plusIconLink');

		browser.initialForm.section.form
			.waitForElementVisible('@createButton');

		browser.initialForm.section.form.section.nameList.section.name
			.fillInput({value: 'Name Field Test'});
		browser.initialForm.section.form.section.nameList.section.fieldA
			.fillInput({firstName: 'First', lastName: 'Last'});

		browser.initialForm.section.form
			.click('@createButton');

		browser.app
			.waitForElementVisible('@itemScreen')
			.navigate()
			.waitForElementVisible('@homeScreen');

		browser.homeScreen.section.fieldsGroup.section.names
			.expect.element('@itemCount').text.to.equal('1 Item');
	},
	'Home view should be accessible from any other non-modal view by clicking the Home link': function (browser) {
		browser.app
			.navigate()
			.waitForElementVisible('@homeScreen');

		browser.homeScreen.section.accessGroup.section.users
			.click('@label');
		browser.app
			.waitForElementVisible('@listScreen');

		browser.app
			.click('@homeIconLink')
			.waitForElementVisible('@homeScreen');
	},
	// UNDO ANY STATE CHANGES -- THIS TEST SHOULD RUN LAST
	'Home view ... undoing any state changes': function (browser) {
		// Delete the Name Field added
		browser.app
			.navigate()
			.waitForElementVisible('@homeScreen');

		browser.app
			.click('@fieldListsMenu')
			.waitForElementVisible('@listScreen');

		browser.app
			.click('@nameListSubmenu')
			.waitForElementVisible('@listScreen');

		browser.listScreen
			.click('@singleItemDeleteIcon');

		browser.deleteConfirmation
			.waitForElementVisible('@deleteButton');

		browser.deleteConfirmation
			.click('@deleteButton');

		browser.app.waitForListScreen();
	},
};
