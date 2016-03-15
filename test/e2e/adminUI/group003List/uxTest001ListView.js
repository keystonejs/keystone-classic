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
			.pause(browser.globals.defaultPauseTimeout)
			.url(adminUI.url)
			.waitForElementVisible(adminUI.cssSelector.homeView.id)
			.pause(browser.globals.defaultPauseTimeout)
			.click(adminUI.cssSelector.allView.fieldsMenu)
			.waitForElementVisible(adminUI.cssSelector.listView.id)
			.pause(browser.globals.defaultPauseTimeout)
	},
	after: function (browser) {
		browser
			.click(adminUI.cssSelector.allView.logoutIconLink)
			.waitForElementVisible(adminUI.cssSelector.signinView.id)
			.pause(browser.globals.defaultPauseTimeout)
			.end();
	},
	'List view should allow users to create a new list item': function (browser) {
		browser
			.click(adminUI.cssSelector.listView.createItemIconWhenListHasNoExistingItems)
			.waitForElementVisible(adminUI.cssSelector.initialModalView.id)
			.setValue(adminUI.cssSelector.initialModalView.fieldType.name.name.name.first, 'First1')
			.setValue(adminUI.cssSelector.initialModalView.fieldType.name.name.name.last, 'Last1')
			.pause(browser.globals.defaultPauseTimeout)
			.click(adminUI.cssSelector.initialModalView.buttonCreate)
			.waitForElementVisible(adminUI.cssSelector.itemView.id)
			.pause(browser.globals.defaultPauseTimeout)
			.click(adminUI.cssSelector.allView.fieldsMenu)
			.waitForElementVisible(adminUI.cssSelector.listView.id)
			.pause(browser.globals.defaultPauseTimeout);

		browser.expect.element(adminUI.cssSelector.listView.paginationCount)
			.text.to.equal('Showing 1 Name');

		browser.expect.element(adminUI.cssSelector.listView.nameColumnValueForNameItemWhenListHasSingleItem)
			.text.to.equal('First1 Last1');
	},
	'List view should allow users to create more new list items': function (browser) {
		browser
			.click(adminUI.cssSelector.allView.fieldsMenu)
			.waitForElementVisible(adminUI.cssSelector.listView.id)
			.pause(browser.globals.defaultPauseTimeout)
			.click(adminUI.cssSelector.listView.createItemIconWhenListHasExistingItems)
			.setValue(adminUI.cssSelector.initialModalView.fieldType.name.name.name.first, 'First2')
			.setValue(adminUI.cssSelector.initialModalView.fieldType.name.name.name.last, 'Last2')
			.pause(browser.globals.defaultPauseTimeout)
			.click(adminUI.cssSelector.initialModalView.buttonCreate)
			.waitForElementVisible(adminUI.cssSelector.itemView.id)
			.pause(browser.globals.defaultPauseTimeout)
			.click(adminUI.cssSelector.allView.fieldsMenu)
			.waitForElementVisible(adminUI.cssSelector.listView.id)
			.pause(browser.globals.defaultPauseTimeout);

		browser.expect.element(adminUI.cssSelector.listView.paginationCount)
			.text.to.equal('Showing 2 Names');

		browser.expect.element(adminUI.cssSelector.listView.nameColumnValueForFirstNameItemWhenListHasMultipleItems)
			.text.to.equal('First1 Last1');

		browser.expect.element(adminUI.cssSelector.listView.nameColumnValueForSecondNameItemWhenListHasMultipleItems)
			.text.to.equal('First2 Last2');
	},
	'List view should allow users to browse an item by clicking the item name': function (browser) {
		browser
			.click(adminUI.cssSelector.allView.fieldsMenu)
			.waitForElementVisible(adminUI.cssSelector.listView.id)
			.pause(browser.globals.defaultPauseTimeout)
			.click(adminUI.cssSelector.listView.nameColumnValueForFirstNameItemWhenListHasMultipleItems)
			.waitForElementVisible(adminUI.cssSelector.itemView.id)
			.pause(browser.globals.defaultPauseTimeout)
			.click(adminUI.cssSelector.allView.fieldsMenu)
			.waitForElementVisible(adminUI.cssSelector.listView.id)
			.pause(browser.globals.defaultPauseTimeout);
	},
	'List view should allow users to browse back to list view from an item view by using the crum links': function (browser) {
		browser
			.click(adminUI.cssSelector.allView.fieldsMenu)
			.waitForElementVisible(adminUI.cssSelector.listView.id)
			.pause(browser.globals.defaultPauseTimeout)
			.click(adminUI.cssSelector.listView.nameColumnValueForFirstNameItemWhenListHasMultipleItems)
			.waitForElementVisible(adminUI.cssSelector.itemView.id)
			.pause(browser.globals.defaultPauseTimeout)
			.click(adminUI.cssSelector.itemView.listBreadcrumb)
			.pause(browser.globals.defaultPauseTimeout);
	},
	'List view should allow users to search for items': function (browser) {
		browser
			.click(adminUI.cssSelector.allView.fieldsMenu)
			.waitForElementVisible(adminUI.cssSelector.listView.id)
			.pause(browser.globals.defaultPauseTimeout)
			.setValue(adminUI.cssSelector.listView.searchInputField, 'First2 Last2')
			.pause(browser.globals.defaultPauseTimeout);

		browser.expect.element(adminUI.cssSelector.listView.paginationCount)
			.text.to.equal('Showing 1 Name');

		browser.expect.element(adminUI.cssSelector.listView.nameColumnValueForNameItemWhenListHasSingleItem)
			.text.to.equal('First2 Last2');
	},
	'List view should allow users to clear search filter': function (browser) {
		browser
			.click(adminUI.cssSelector.listView.searchInputFieldClearIcon)
			.pause(browser.globals.defaultPauseTimeout);

		browser.expect.element(adminUI.cssSelector.listView.paginationCount)
			.text.to.equal('Showing 2 Names');

		browser.expect.element(adminUI.cssSelector.listView.nameColumnValueForFirstNameItemWhenListHasMultipleItems)
			.text.to.equal('First1 Last1');

		browser.expect.element(adminUI.cssSelector.listView.nameColumnValueForSecondNameItemWhenListHasMultipleItems)
			.text.to.equal('First2 Last2');
	},
	'List view should allow users to delete items': function (browser) {
		browser
			.click(adminUI.cssSelector.listView.deleteSecondItemIconWhenListHasMultipleItems)
			.waitForElementVisible(adminUI.cssSelector.deleteConfirmationModalView.id)
			.click(adminUI.cssSelector.deleteConfirmationModalView.buttonDelete)
			.pause(browser.globals.defaultPauseTimeout);

		browser.expect.element(adminUI.cssSelector.listView.paginationCount)
			.text.to.equal('Showing 1 Name');

		browser.expect.element(adminUI.cssSelector.listView.nameColumnValueForNameItemWhenListHasSingleItem)
			.text.to.equal('First1 Last1');
	},
	'List view should allow users to delete last item': function (browser) {
		browser
			.click(adminUI.cssSelector.listView.deleteItemIconWhenListHasSingleItem)
			.waitForElementVisible(adminUI.cssSelector.deleteConfirmationModalView.id)
			.click(adminUI.cssSelector.deleteConfirmationModalView.buttonDelete)
			.pause(browser.globals.defaultPauseTimeout);

		browser.expect.element(adminUI.cssSelector.listView.noItemsFoundNoText)
			.text.to.equal('No');

		browser.expect.element(adminUI.cssSelector.listView.noItemsFoundListNameText)
			.text.to.equal('names');

		browser.expect.element(adminUI.cssSelector.listView.noItemsFoundFoundText)
			.text.to.equal('found…');
	},

	// UNDO ANY STATE CHANGES -- THIS TEST SHOULD RUN LAST
	'List view ... undoing any state changes': function (browser) {
	},
};
