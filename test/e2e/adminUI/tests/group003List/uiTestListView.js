module.exports = {
	before: function (browser) {
		browser.app = browser.page.app();
		browser.signinPage = browser.page.signin();
		browser.listPage = browser.page.list();
		browser.itemPage = browser.page.item();
		browser.initialFormPage = browser.page.initialForm();
		browser.deleteConfirmationPage = browser.page.deleteConfirmation();

		browser.app.navigate();
		browser.app.waitForElementVisible('@signinScreen');

		browser.signinPage.signin();
		browser.app.waitForElementVisible('@homeScreen');
	},
	after: function (browser) {
		browser.app.signout();
		browser.end();
	},
	'List view must have a search bar': function (browser) {
		browser.app
			.click('@accessMenu')
			.waitForElementVisible('@listScreen');

		browser.listPage
			.expect.element('@searchInputField').to.be.visible;
	},
	'List view must have a filter input': function (browser) {
		browser.listPage
			.expect.element('@filterDropdown').to.be.visible;
	},
	'List view must have a column input': function (browser) {
		browser.listPage
			.expect.element('@columnDropdown').to.be.visible;
	},
	'List view must have a download input': function (browser) {
		browser.listPage
			.expect.element('@downloadDropdown').to.be.visible;
	},
	// TODO:  For some reason the expand table width input control does not show in saucelabs' Firefox 44...why?
	//		It shows fine with local selenium server and Firefox 44.0.2
	//'List view must have an expand table width input': function (browser) {
	//	browser.expect.element(adminUI.cssSelector.listView.expandTableIcon)
	//			      .to.be.visible;
	//},
	'List view must have a create list item button': function (browser) {
		browser.listPage
			.expect.element('@createFirstItemButton').to.be.visible;
	},
	'List view must have a pagination count': function (browser) {
		browser.listPage
			.expect.element('@paginationCount').to.be.visible;
	},
	'List view must have a name column header': function (browser) {
		browser.listPage
			.expect.element('@firstColumnHeader').to.be.visible;

		browser.listPage
			.expect.element('@firstColumnHeader').text.to.equal('Name');
	},
	'List view must have an email column header': function (browser) {
		browser.listPage
			.expect.element('@secondColumnHeader').to.be.visible;

		browser.listPage
			.expect.element('@secondColumnHeader').text.to.equal('Email');
	},
	'List view must have an Is Admin column header': function (browser) {
		browser.listPage
			.expect.element('@thirdColumnHeader').to.be.visible;

		browser.listPage
			.expect.element('@thirdColumnHeader').text.to.equal('Is Admin');
	},
	'List view items must a delete icon': function (browser) {
		browser.listPage
			.expect.element('@firstItemDeleteIcon').to.be.visible;
	},
	'List view user item must have a name value': function (browser) {
		browser.listPage
			.expect.element('@firstColumnValue').to.be.visible;

		browser.listPage
			.expect.element('@firstColumnValue').text.to.equal('test e2e');
	},
	'List view user item must have a value in the email column': function (browser) {
		browser.listPage
			.expect.element('@secondColumnValue').to.be.visible;

		browser.listPage
			.expect.element('@secondColumnValue').text.to.equal('test@test.e2e');
	},
	'List view user item must have a value in the Is Admin column': function (browser) {
		browser.listPage
			.expect.element('@thirdColumnValue').to.be.visible;
	},
};
