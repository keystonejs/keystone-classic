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
			.pause(browser.globals.defaultPauseTimeout)
			.url(adminUI.url)
			.waitForElementVisible(adminUI.cssSelectors.homeView.id)
			.pause(browser.globals.defaultPauseTimeout)
			.click(adminUI.cssSelectors.allView.fieldsMenu)
			.waitForElementVisible(adminUI.cssSelectors.listView.id)
			.pause(browser.globals.defaultPauseTimeout)
	},
	after: function (browser) {
		browser
			.click(adminUI.cssSelectors.allView.logoutIconLink)
			.waitForElementVisible(adminUI.cssSelectors.signinView.id)
			.pause(browser.globals.defaultPauseTimeout)
			.end();
	},
	'List view should allow users to create a new list item': function (browser) {
		browser
			.click(adminUI.cssSelectors.listView.createItemIconWhenListHasNoExistingItems)
			.waitForElementVisible(adminUI.cssSelectors.initialModalView.id)
			.setValue(adminUI.cssSelectors.initialModalView.field.name.first, 'First1')
			.setValue(adminUI.cssSelectors.initialModalView.field.name.last, 'Last1')
			.pause(browser.globals.defaultPauseTimeout)
			.click(adminUI.cssSelectors.initialModalView.buttonCreate)
			.waitForElementVisible(adminUI.cssSelectors.itemView.id)
			.pause(browser.globals.defaultPauseTimeout)
			.click(adminUI.cssSelectors.allView.fieldsMenu)
			.waitForElementVisible(adminUI.cssSelectors.listView.id)
			.pause(browser.globals.defaultPauseTimeout);

		browser.expect.element(adminUI.cssSelectors.listView.paginationCount)
			.text.to.equal('Showing 1 Name Field');

		browser.expect.element(adminUI.cssSelectors.listView.nameColumnValueForNameFieldItemWhenListHasSingleItem)
			.text.to.equal('First1 Last1');
	},
	'List view should allow users to create more new list items': function (browser) {
		browser
			.click(adminUI.cssSelectors.allView.fieldsMenu)
			.waitForElementVisible(adminUI.cssSelectors.listView.id)
			.pause(browser.globals.defaultPauseTimeout)
			.click(adminUI.cssSelectors.listView.createItemIconWhenListHasExistingItems)
			.setValue(adminUI.cssSelectors.initialModalView.field.name.first, 'First2')
			.setValue(adminUI.cssSelectors.initialModalView.field.name.last, 'Last2')
			.pause(browser.globals.defaultPauseTimeout)
			.click(adminUI.cssSelectors.initialModalView.buttonCreate)
			.waitForElementVisible(adminUI.cssSelectors.itemView.id)
			.pause(browser.globals.defaultPauseTimeout)
			.click(adminUI.cssSelectors.allView.fieldsMenu)
			.waitForElementVisible(adminUI.cssSelectors.listView.id)
			.pause(browser.globals.defaultPauseTimeout);

		browser.expect.element(adminUI.cssSelectors.listView.paginationCount)
			.text.to.equal('Showing 2 Name Fields');

		browser.expect.element(adminUI.cssSelectors.listView.nameColumnValueForFirstNameFieldItemWhenListHasMultipleItems)
			.text.to.equal('First1 Last1');

		browser.expect.element(adminUI.cssSelectors.listView.nameColumnValueForSecondNameFieldItemWhenListHasMultipleItems)
			.text.to.equal('First2 Last2');
	},
	'List view should allow users to browse an item by clicking the item name': function (browser) {
		browser
			.click(adminUI.cssSelectors.allView.fieldsMenu)
			.waitForElementVisible(adminUI.cssSelectors.listView.id)
			.pause(browser.globals.defaultPauseTimeout)
			.click(adminUI.cssSelectors.listView.nameColumnValueForFirstNameFieldItemWhenListHasMultipleItems)
			.waitForElementVisible(adminUI.cssSelectors.itemView.id)
			.pause(browser.globals.defaultPauseTimeout)
			.click(adminUI.cssSelectors.allView.fieldsMenu)
			.waitForElementVisible(adminUI.cssSelectors.listView.id)
			.pause(browser.globals.defaultPauseTimeout);
	},
	'List view should allow users to browse back to list view from an item view by using the crum links': function (browser) {
		browser
			.click(adminUI.cssSelectors.allView.fieldsMenu)
			.waitForElementVisible(adminUI.cssSelectors.listView.id)
			.pause(browser.globals.defaultPauseTimeout)
			.click(adminUI.cssSelectors.listView.nameColumnValueForFirstNameFieldItemWhenListHasMultipleItems)
			.waitForElementVisible(adminUI.cssSelectors.itemView.id)
			.pause(browser.globals.defaultPauseTimeout)
			.click(adminUI.cssSelectors.itemView.listBreadcrumb)
			.pause(browser.globals.defaultPauseTimeout);
	},
	'List view should allow users to search for items': function (browser) {
		browser
			.click(adminUI.cssSelectors.allView.fieldsMenu)
			.waitForElementVisible(adminUI.cssSelectors.listView.id)
			.pause(browser.globals.defaultPauseTimeout)
			.setValue(adminUI.cssSelectors.listView.searchInputField, 'First2 Last2')
			.pause(browser.globals.defaultPauseTimeout);

		browser.expect.element(adminUI.cssSelectors.listView.paginationCount)
			.text.to.equal('Showing 1 Name Field');

		browser.expect.element(adminUI.cssSelectors.listView.nameColumnValueForNameFieldItemWhenListHasSingleItem)
			.text.to.equal('First2 Last2');
	},
	'List view should allow users to clear search filter': function (browser) {
		browser
			.click(adminUI.cssSelectors.listView.searchInputFieldClearIcon)
			.pause(browser.globals.defaultPauseTimeout);

		browser.expect.element(adminUI.cssSelectors.listView.paginationCount)
			.text.to.equal('Showing 2 Name Fields');

		browser.expect.element(adminUI.cssSelectors.listView.nameColumnValueForFirstNameFieldItemWhenListHasMultipleItems)
			.text.to.equal('First1 Last1');

		browser.expect.element(adminUI.cssSelectors.listView.nameColumnValueForSecondNameFieldItemWhenListHasMultipleItems)
			.text.to.equal('First2 Last2');
	},
	'List view should allow users to delete items': function (browser) {
		browser
			.click(adminUI.cssSelectors.listView.deleteSecondItemIconWhenListHasMultipleItems)
			.waitForElementVisible(adminUI.cssSelectors.deleteConfirmationModalView.id)
			.click(adminUI.cssSelectors.deleteConfirmationModalView.buttonDelete)
			.pause(browser.globals.defaultPauseTimeout);

		browser.expect.element(adminUI.cssSelectors.listView.paginationCount)
			.text.to.equal('Showing 1 Name Field');

		browser.expect.element(adminUI.cssSelectors.listView.nameColumnValueForNameFieldItemWhenListHasSingleItem)
			.text.to.equal('First1 Last1');
	},
	'List view should allow users to delete last item': function (browser) {
		browser
			.click(adminUI.cssSelectors.listView.deleteItemIconWhenListHasSingleItem)
			.waitForElementVisible(adminUI.cssSelectors.deleteConfirmationModalView.id)
			.click(adminUI.cssSelectors.deleteConfirmationModalView.buttonDelete)
			.pause(browser.globals.defaultPauseTimeout);

		browser.expect.element(adminUI.cssSelectors.listView.noItemsFoundNoText)
			.text.to.equal('No');

		browser.expect.element(adminUI.cssSelectors.listView.noItemsFoundListNameText)
			.text.to.equal('name fields');

		browser.expect.element(adminUI.cssSelectors.listView.noItemsFoundFoundText)
			.text.to.equal('found…');
	},

	// UNDO ANY STATE CHANGES -- THIS TEST SHOULD RUN LAST
	'List view ... undoing any state changes': function (browser) {
	},
};
