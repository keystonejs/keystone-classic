var adminUI = require('../adminUI');

module.exports = {
	before: function (browser) {
		browser
			.url(adminUI.url)
			.waitForElementVisible(adminUI.cssSelector.signinView.id)
			.setValue(adminUI.cssSelector.signinView.emailInput, adminUI.login.email)
			.setValue(adminUI.cssSelector.signinView.passwordInput, adminUI.login.password)
			.pause(browser.globals.defaultPauseTimeout)
			.click(adminUI.cssSelector.signinView.submitButton)
			.pause(browser.globals.defaultPauseTimeout);
	},
	after: function (browser) {
		browser
			.url(adminUI.url)
			.waitForElementVisible(adminUI.cssSelector.homeView.id)
			.pause(browser.globals.defaultPauseTimeout)
			.click(adminUI.cssSelector.allView.logoutIconLink)
			.pause(browser.globals.defaultPauseTimeout)
			.end();
	},
	'Home view should allow clicking a nav menu item such as Access to show the list of items': function (browser) {
		browser
			.url(adminUI.url)
			.waitForElementVisible(adminUI.cssSelector.homeView.id)
			.pause(browser.globals.defaultPauseTimeout)
			.click(adminUI.cssSelector.allView.accessMenu)
			.waitForElementVisible(adminUI.cssSelector.listView.id)
			.pause(browser.globals.defaultPauseTimeout)
			.url(adminUI.url)
			.waitForElementVisible(adminUI.cssSelector.homeView.id)
			.pause(browser.globals.defaultPauseTimeout)
			.click(adminUI.cssSelector.allView.fieldsMenu)
			.waitForElementVisible(adminUI.cssSelector.listView.id)
			.pause(browser.globals.defaultPauseTimeout);
	},
	'Home view should allow clicking a card list item such as Users to should show the list of those items': function (browser) {
		browser
			.url(adminUI.url)
			.waitForElementVisible(adminUI.cssSelector.homeView.id)
			.pause(browser.globals.defaultPauseTimeout)
			.click(adminUI.cssSelector.homeView.usersTabUnderDashboardAccessSubheading)
			.waitForElementVisible(adminUI.cssSelector.listView.id)
			.pause(browser.globals.defaultPauseTimeout);
	},
	'Home view should allow an admin to create a new list item such as a user': function (browser) {
		browser
			.url(adminUI.url)
			.waitForElementVisible(adminUI.cssSelector.homeView.id)
			.pause(browser.globals.defaultPauseTimeout)
			.click(adminUI.cssSelector.homeView.plusIconLinkForUsersTabUnderDashboardAccessSubheading)
			.waitForElementVisible(adminUI.cssSelector.initialModalView.id)
			.pause(browser.globals.defaultPauseTimeout);
	},
	'Home view should allow an admin to create a new list item and increment the item count': function (browser) {
		browser
			.url(adminUI.url)
			.waitForElementVisible(adminUI.cssSelector.homeView.id)
			.pause(browser.globals.defaultPauseTimeout);

		browser.expect.element(adminUI.cssSelector.homeView.itemCountForNamesTabUnderDashboardFieldsSubheading)
			.text.to.equal('0 Items');

		browser
			.click(adminUI.cssSelector.homeView.plusIconLinkForNamesTabUnderDashboardFieldsSubheading)
			.waitForElementVisible(adminUI.cssSelector.initialModalView.id)
			.setValue(adminUI.cssSelector.initialModalView.field.name.first, 'First')
			.setValue(adminUI.cssSelector.initialModalView.field.name.last, 'Last')
			.pause(browser.globals.defaultPauseTimeout)
			.click(adminUI.cssSelector.initialModalView.buttonCreate)
			.waitForElementVisible(adminUI.cssSelector.itemView.id)
			.url(adminUI.url);

		browser.expect.element(adminUI.cssSelector.homeView.itemCountForNamesTabUnderDashboardFieldsSubheading)
			.text.to.equal('1 Item');
	},
	'Home view should be accessible from any other non-modal view by clicking the Home link': function (browser) {
		browser
			.url(adminUI.url)
			.waitForElementVisible(adminUI.cssSelector.homeView.id)
			.pause(browser.globals.defaultPauseTimeout)
			.click(adminUI.cssSelector.homeView.usersTabUnderDashboardAccessSubheading)
			.waitForElementVisible(adminUI.cssSelector.listView.id)
			.pause(browser.globals.defaultPauseTimeout)
			.click(adminUI.cssSelector.allView.homeIconLink)
			.waitForElementVisible(adminUI.cssSelector.homeView.id)
			.pause(browser.globals.defaultPauseTimeout);
	},

	// UNDO ANY STATE CHANGES -- THIS TEST SHOULD RUN LAST
	'Home view ... undoing any state changes': function (browser) {
		// Delete the Name Field added
		browser
			.url(adminUI.url)
			.waitForElementVisible(adminUI.cssSelector.homeView.id)
			.pause(browser.globals.defaultPauseTimeout)
			.click(adminUI.cssSelector.allView.fieldsMenu)
			.waitForElementVisible(adminUI.cssSelector.listView.id)
			.pause(browser.globals.defaultPauseTimeout)
			.click(adminUI.cssSelector.listView.singleItemDeleteIcon)
			.waitForElementVisible(adminUI.cssSelector.deleteConfirmationModalView.id)
			.click(adminUI.cssSelector.deleteConfirmationModalView.buttonDelete);
	},
};
