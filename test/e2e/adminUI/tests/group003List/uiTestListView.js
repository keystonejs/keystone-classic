module.exports = {
	before: function (browser) {
		browser.adminUIApp = browser.page.adminUIApp();
		browser.signinScreen = browser.page.signinScreen();
		browser.listScreen = browser.page.listScreen();
		browser.itemScreen = browser.page.itemScreen();
		browser.initialFormScreen = browser.page.initialForm();
		browser.deleteConfirmationScreen = browser.page.deleteConfirmation();

		browser.adminUIApp
			.gotoHomeScreen()
			.waitForSigninScreen();

		browser.signinScreen.signin();

		browser.adminUIApp.waitForHomeScreen();
	},
	after: function (browser) {
		browser.adminUIApp.signout();
		browser.end();
	},
	'List screen must have a search bar': function (browser) {
		browser.adminUIApp
			.click('@accessMenu')
			.waitForListScreen();

		browser.listScreen
			.expect.element('@searchInputField').to.be.visible;
	},
	'List screen must have a filter input': function (browser) {
		browser.listScreen
			.expect.element('@filterDropdown').to.be.visible;
	},
	'List screen must have a column input': function (browser) {
		browser.listScreen
			.expect.element('@columnDropdown').to.be.visible;
	},
	'List screen must have a download input': function (browser) {
		browser.listScreen
			.expect.element('@downloadDropdown').to.be.visible;
	},
	// TODO:  For some reason the expand table width input control does not show in saucelabs' Firefox 44...why?
	//		It shows fine with local selenium server and Firefox 44.0.2
	//'List screen must have an expand table width input': function (browser) {
	//	browser.expect.element(adminUI.cssSelector.listView.expandTableIcon)
	//			      .to.be.visible;
	//},
	'List screen must have a create list item button': function (browser) {
		browser.listScreen
			.expect.element('@createMoreItemsButton').to.be.visible;
	},
	'List screen must have a pagination count': function (browser) {
		browser.listScreen
			.expect.element('@paginationCount').to.be.visible;
	},
	'List screen must have a name column header': function (browser) {
		browser.listScreen
			.expect.element('@firstColumnHeader').to.be.visible;

		browser.listScreen
			.expect.element('@firstColumnHeader').text.to.equal('Name');
	},
	'List screen must have an email column header': function (browser) {
		browser.listScreen
			.expect.element('@secondColumnHeader').to.be.visible;

		browser.listScreen
			.expect.element('@secondColumnHeader').text.to.equal('Email');
	},
	'List screen must have an Is Admin column header': function (browser) {
		browser.listScreen
			.expect.element('@thirdColumnHeader').to.be.visible;

		browser.listScreen
			.expect.element('@thirdColumnHeader').text.to.equal('Is Admin');
	},
	'List screen items must a delete icon': function (browser) {
		browser.listScreen
			.expect.element('@firstItemDeleteIcon').to.be.visible;
		browser.listScreen
			.expect.element('@secondItemDeleteIcon').to.be.visible;
	},
	'List screen user item must have a name value': function (browser) {
		browser.listScreen
			.expect.element('@firstItemFirstColumnValue').to.be.visible;

		browser.listScreen
			.expect.element('@firstItemFirstColumnValue').text.to.equal('e2e member');

		browser.listScreen
			.expect.element('@secondItemFirstColumnValue').to.be.visible;

		browser.listScreen
			.expect.element('@secondItemFirstColumnValue').text.to.equal('e2e user');
	},
	'List screen user item must have a value in the email column': function (browser) {
		browser.listScreen
			.expect.element('@firstItemSecondColumnValue').to.be.visible;

		browser.listScreen
			.expect.element('@firstItemSecondColumnValue').text.to.equal('member@test.e2e');

		browser.listScreen
			.expect.element('@secondItemSecondColumnValue').to.be.visible;

		browser.listScreen
			.expect.element('@secondItemSecondColumnValue').text.to.equal('user@test.e2e');
	},
	'List screen user item must have a value in the Is Admin column': function (browser) {
		browser.listScreen
			.expect.element('@firstItemThirdColumnValue').to.be.visible;

		browser.listScreen
			.expect.element('@secondItemThirdColumnValue').to.be.visible;
	},
	'List screen user item must be an Admin and not a Member': function (browser) {
		browser.listScreen
			.expect.element('@secondUserItemIsAdmin').to.be.visible;

		browser.listScreen
			.expect.element('@secondUserItemIsNotMember').to.be.visible;
	},
	'List screen member item must be a Member and not an Admin': function (browser) {
		browser.listScreen
			.expect.element('@firstUserItemIsMember').to.be.visible;

		browser.listScreen
			.expect.element('@firstUserItemIsNotAdmin').to.be.visible;
	},
};
