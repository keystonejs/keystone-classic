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
			.click(adminUI.cssSelectors.allView.accessMenu)
			.waitForElementVisible(adminUI.cssSelectors.listView.id)
			.pause(browser.globals.defaultPauseTimeout)
	},
	after: function (browser) {
		browser
			.click(adminUI.cssSelectors.allView.logoutIconLink)
			.pause(browser.globals.defaultPauseTimeout)
			.end();
	},
	'List view must have a search bar': function (browser) {
		browser
			.click(adminUI.cssSelectors.allView.accessMenu)
			.waitForElementVisible(adminUI.cssSelectors.listView.id);

		browser.expect.element(adminUI.cssSelectors.listView.searchInputField)
				      .to.be.visible;
	},
	'List view must have a filter input': function (browser) {
		browser.expect.element(adminUI.cssSelectors.listView.filterDropdown)
				      .to.be.visible;
	},
	'List view must have a column input': function (browser) {
		browser.expect.element(adminUI.cssSelectors.listView.columnDropdown)
				      .to.be.visible;
	},
	'List view must have a download input': function (browser) {
		browser.expect.element(adminUI.cssSelectors.listView.downloadDropdown)
				      .to.be.visible;
	},
	// TODO:  For some reason the expand table width input control does not show in saucelabs' Firefox 44...why?
	//		It shows fine with local selenium server and Firefox 44.0.2
	//'List view must have an expand table width input': function (browser) {
	//	browser.expect.element(adminUI.cssSelectors.listView.expandTableIcon)
	//			      .to.be.visible;
	//},
	'List view must have a create list item button': function (browser) {
		browser.expect.element(adminUI.cssSelectors.listView.createItemIconWhenListHasExistingItems)
				      .to.be.visible;
	},
	'List view must have a pagination count': function (browser) {
		browser.expect.element(adminUI.cssSelectors.listView.paginationCount)
				      .to.be.visible;
	},
	'List view must have a name column header': function (browser) {
		browser.expect.element(adminUI.cssSelectors.listView.nameColumnHeaderForUserList)
				      .to.be.visible;
		browser.expect.element(adminUI.cssSelectors.listView.nameColumnHeaderForUserList)
				      .text.to.equal('Name');
	},
	'List view must have an email column header': function (browser) {
		browser.expect.element(adminUI.cssSelectors.listView.emailColumnHeaderForUserList)
				      .to.be.visible;
		browser.expect.element(adminUI.cssSelectors.listView.emailColumnHeaderForUserList)
				      .text.to.equal('Email');
	},
	'List view must have an Is Admin column header': function (browser) {
		browser.expect.element(adminUI.cssSelectors.listView.isAdminColumnHeaderForUserList)
				      .to.be.visible;
		browser.expect.element(adminUI.cssSelectors.listView.isAdminColumnHeaderForUserList)
				      .text.to.equal('Is Admin');
	},
	'List view items must a delete icon': function (browser) {
		browser.expect.element(adminUI.cssSelectors.listView.deleteItemIconWhenListHasSingleItem)
				      .to.be.visible;
	},
	'List view user item must have a name value': function (browser) {
		browser.expect.element(adminUI.cssSelectors.listView.nameColumnValueForUserList)
				      .to.be.visible;
		browser.expect.element(adminUI.cssSelectors.listView.nameColumnValueForUserList)
				      .text.to.equal('test e2e');
	},
	'List view user item must have a value in the email column': function (browser) {
		browser.expect.element(adminUI.cssSelectors.listView.emailColumnValueForUserList)
				      .to.be.visible;
		browser.expect.element(adminUI.cssSelectors.listView.emailColumnValueForUserList)
				      .text.to.equal('test@test.e2e');
	},
	'List view user item must have a value in the Is Admin column': function (browser) {
		browser.expect.element(adminUI.cssSelectors.listView.isAdminColumnValueForUserList)
				      .to.be.visible;
		browser.expect.element(adminUI.cssSelectors.listView.isAdminColumnValueForUserList)
				      .to.be.visible;
	},
};
