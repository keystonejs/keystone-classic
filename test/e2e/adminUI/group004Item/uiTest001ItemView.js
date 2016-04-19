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
			.click(adminUI.cssSelector.allView.accessMenu)
			.waitForElementVisible(adminUI.cssSelector.listView.id)
			.pause(browser.globals.defaultPauseTimeout)
			.click(adminUI.cssSelector.listView.nameColumnValueForUserList)
			.waitForElementVisible(adminUI.cssSelector.itemView.id)
			.pause(browser.globals.defaultPauseTimeout);
	},
	after: function (browser) {
		browser
			.click(adminUI.cssSelector.allView.logoutIconLink)
			.pause(browser.globals.defaultPauseTimeout)
			.end();
	},
	'Item view should have a search input icon to search for list items': function (browser) {
		browser.expect.element(adminUI.cssSelector.itemView.searchInputIcon)
			.to.be.visible;
	},
	// FIXME: TODO
	// 'Item view should have breadcrumb links to go back to the origin list': function (browser) {
	// 	browser.expect.element(adminUI.cssSelector.itemView.breadcrumpForUsersList)
	// 		.to.be.visible;
	//
	// 	browser.expect.element(adminUI.cssSelector.itemView.breadcrumpForUsersList)
	// 		.text.to.equal('Users');
	// },
	'Item view should have a + New <item> button to create new items': function (browser) {
		browser.expect.element(adminUI.cssSelector.itemView.newItemPlusButton)
			.to.be.visible;
	},
	'Item view should have an item name header': function (browser) {
		browser.expect.element(adminUI.cssSelector.itemView.itemNameHeader)
			.to.be.visible;

		browser.expect.element(adminUI.cssSelector.itemView.itemNameHeader)
			.text.to.equal('test e2e');
	},
	'Item view should have an item id': function (browser) {
		browser.expect.element(adminUI.cssSelector.itemView.itemId)
			.to.be.visible;
	},
	'Item view should have an item Meta header': function (browser) {
		browser.expect.element(adminUI.cssSelector.itemView.itemMetaHeader)
			.to.be.visible;

		browser.expect.element(adminUI.cssSelector.itemView.itemMetaHeader)
			.text.to.equal('Meta');
	},
	'Item view should have an item meta Created On': function (browser) {
		browser.expect.element(adminUI.cssSelector.itemView.itemMetaCreatedOn)
			.to.be.visible;
	},
	'Item view should have an item save button': function (browser) {
		browser.expect.element(adminUI.cssSelector.itemView.itemSaveButton)
			.to.be.visible;

		browser.expect.element(adminUI.cssSelector.itemView.itemSaveButton)
			.text.to.equal('Save');
	},
	'Item view should have an item reset button': function (browser) {
		browser.expect.element(adminUI.cssSelector.itemView.itemResetButton)
			.to.be.visible;

		browser.expect.element(adminUI.cssSelector.itemView.itemResetButtonText)
			.text.to.equal('reset changes');
	},
	'Item view should have an item delete button': function (browser) {
		browser.expect.element(adminUI.cssSelector.itemView.itemDeleteButton)
			.to.be.visible;

		browser.expect.element(adminUI.cssSelector.itemView.itemDeleteButtonText)
			.text.to.equal('delete user');
	},
};
