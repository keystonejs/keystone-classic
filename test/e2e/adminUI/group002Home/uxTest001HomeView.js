var adminUI = require('../adminUI');

module.exports = {
	before: function (browser) {
		browser
			.url(adminUI.url)
			.waitForElementVisible(adminUI.cssSelectors.signinView.id)
			.setValue(adminUI.cssSelectors.signinView.emailInput, adminUI.login.email)
			.setValue(adminUI.cssSelectors.signinView.passwordInput, adminUI.login.password)
			.pause(browser.globals.defaultPauseTimeout)
			.click(adminUI.cssSelectors.signinView.submitButton)
			.pause(browser.globals.defaultPauseTimeout);
	},
	after: function (browser) {
		browser
			.url(adminUI.url)
			.waitForElementVisible(adminUI.cssSelectors.homeView.id)
			.pause(browser.globals.defaultPauseTimeout)
			.click(adminUI.cssSelectors.allView.logoutIconLink)
			.pause(browser.globals.defaultPauseTimeout)
			.end();
	},
	'Home view should allow clicking a nav menu item such as Access to show the list of items': function (browser) {
		browser
			.url(adminUI.url)
			.waitForElementVisible(adminUI.cssSelectors.homeView.id)
			.pause(browser.globals.defaultPauseTimeout)
			.click(adminUI.cssSelectors.allView.accessMenu)
			.waitForElementVisible(adminUI.cssSelectors.listView.id)
			.pause(browser.globals.defaultPauseTimeout)
			.url(adminUI.url)
			.waitForElementVisible(adminUI.cssSelectors.homeView.id)
			.pause(browser.globals.defaultPauseTimeout)
			.click(adminUI.cssSelectors.allView.fieldsMenu)
			.waitForElementVisible(adminUI.cssSelectors.listView.id)
			.pause(browser.globals.defaultPauseTimeout);
	},
	'Home view should allow clicking a card list item such as Users to should show the list of those items': function (browser) {
		browser
			.url(adminUI.url)
			.waitForElementVisible(adminUI.cssSelectors.homeView.id)
			.pause(browser.globals.defaultPauseTimeout)
			.click(adminUI.cssSelectors.homeView.usersTabUnderDashboardAccessSubheading)
			.waitForElementVisible(adminUI.cssSelectors.listView.id)
			.pause(browser.globals.defaultPauseTimeout);
	},
	'Home view should allow an admin to create a new list item such as a user': function (browser) {
		browser
			.url(adminUI.url)
			.waitForElementVisible(adminUI.cssSelectors.homeView.id)
			.pause(browser.globals.defaultPauseTimeout)
			.click(adminUI.cssSelectors.homeView.plusIconLinkForUsersTabUnderDashboardAccessSubheading)
			.waitForElementVisible(adminUI.cssSelectors.initialModalView.id)
			.pause(browser.globals.defaultPauseTimeout);
	},
	'Home view should allow an admin to create a new list item and increment the item count': function (browser) {
		browser
			.url(adminUI.url)
			.waitForElementVisible(adminUI.cssSelectors.homeView.id)
			.pause(browser.globals.defaultPauseTimeout);

		browser.expect.element(adminUI.cssSelectors.homeView.itemCountForNameFieldsTabUnderDashboardFieldsSubheading)
					  .text.to.equal('0 Items');

		browser
			.click(adminUI.cssSelectors.homeView.plusIconLinkForNameFieldsTabUnderDashboardFieldsSubheading)
			.waitForElementVisible(adminUI.cssSelectors.initialModalView.id)
			.setValue(adminUI.cssSelectors.initialModalView.field.name.first, 'First')
			.setValue(adminUI.cssSelectors.initialModalView.field.name.last, 'Last')
			.pause(browser.globals.defaultPauseTimeout)
			.click(adminUI.cssSelectors.initialModalView.buttonCreate)
			.waitForElementVisible(adminUI.cssSelectors.itemView.id)
			.url(adminUI.url);

		browser.expect.element(adminUI.cssSelectors.homeView.itemCountForNameFieldsTabUnderDashboardFieldsSubheading)
			.text.to.equal('1 Item');
	},
	'Home view should be accessible from any other non-modal view by clicking the Home link': function (browser) {
		browser
			.url(adminUI.url)
			.waitForElementVisible(adminUI.cssSelectors.homeView.id)
			.pause(browser.globals.defaultPauseTimeout)
			.click(adminUI.cssSelectors.homeView.usersTabUnderDashboardAccessSubheading)
			.waitForElementVisible(adminUI.cssSelectors.listView.id)
			.pause(browser.globals.defaultPauseTimeout)
			.click(adminUI.cssSelectors.allView.homeIconLink)
			.waitForElementVisible(adminUI.cssSelectors.homeView.id)
			.pause(browser.globals.defaultPauseTimeout);
	},

	// UNDO ANY STATE CHANGES -- THIS TEST SHOULD RUN LAST
	'Home view ... undoing any state changes': function (browser) {
		// Delete the Name Field added
		browser
			.url(adminUI.url)
			.waitForElementVisible(adminUI.cssSelectors.homeView.id)
			.pause(browser.globals.defaultPauseTimeout)
			.click(adminUI.cssSelectors.allView.fieldsMenu)
			.waitForElementVisible(adminUI.cssSelectors.listView.id)
			.pause(browser.globals.defaultPauseTimeout)
			.click(adminUI.cssSelectors.listView.singleItemDeleteIcon)
			.waitForElementVisible(adminUI.cssSelectors.deleteConfirmationModalView.id)
			.click(adminUI.cssSelectors.deleteConfirmationModalView.buttonDelete);
	},
};
