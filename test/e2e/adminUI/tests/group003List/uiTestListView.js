module.exports = {
	before: function (browser) {
		browser.adminUIApp = browser.page.adminUIApp();
		browser.adminUISignin = browser.page.adminUISignin();
		browser.adminUIListScreen = browser.page.adminUIListScreen();
		browser.adminUIItemScreen = browser.page.adminUIItemScreen();
		browser.adminUIInitialFormScreen = browser.page.adminUIInitialForm();
		browser.adminUIDeleteConfirmation = browser.page.adminUIDeleteConfirmation();

		browser.adminUIApp.gotoHomeScreen();
		browser.adminUIApp.waitForSigninScreen();

		browser.adminUISignin.signin();

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

		browser.adminUIListScreen
			.expect.element('@searchInputField').to.be.visible;
	},
	'List screen must have a filter input': function (browser) {
		browser.adminUIListScreen
			.expect.element('@filterDropdown').to.be.visible;
	},
	'List screen must have a column input': function (browser) {
		browser.adminUIListScreen
			.expect.element('@columnDropdown').to.be.visible;
	},
	'List screen must have a download input': function (browser) {
		browser.adminUIListScreen
			.expect.element('@downloadDropdown').to.be.visible;
	},
	// TODO:  For some reason the expand table width input control does not show in saucelabs' Firefox 44...why?
	//		It shows fine with local selenium server and Firefox 44.0.2
	//'List screen must have an expand table width input': function (browser) {
	//	browser.expect.element(adminUI.cssSelector.listView.expandTableIcon)
	//			      .to.be.visible;
	//},
	'List screen must have a create list item button': function (browser) {
		browser.adminUIListScreen
			.expect.element('@createMoreItemsButton').to.be.visible;
	},
	'List screen must have a pagination count': function (browser) {
		browser.adminUIListScreen
			.expect.element('@paginationCount').to.be.visible;
	},
	'List screen must have a name column header': function (browser) {
		browser.adminUIListScreen
			.expect.element('@firstColumnHeader').to.be.visible;

		browser.adminUIListScreen
			.expect.element('@firstColumnHeader').text.to.equal('Name');
	},
	'List screen must have an email column header': function (browser) {
		browser.adminUIListScreen
			.expect.element('@secondColumnHeader').to.be.visible;

		browser.adminUIListScreen
			.expect.element('@secondColumnHeader').text.to.equal('Email');
	},
	'List screen must have an Is Admin column header': function (browser) {
		browser.adminUIListScreen
			.expect.element('@thirdColumnHeader').to.be.visible;

		browser.adminUIListScreen
			.expect.element('@thirdColumnHeader').text.to.equal('Is Admin');
	},
	'List screen items must a delete icon': function (browser) {
		browser.adminUIListScreen
			.expect.element('@firstItemDeleteIcon').to.be.visible;
		browser.adminUIListScreen
			.expect.element('@secondItemDeleteIcon').to.be.visible;
	},
	'List screen user item must have a name value': function (browser) {
		browser.adminUIListScreen
			.expect.element('@firstItemFirstColumnValue').to.be.visible;

		browser.adminUIListScreen
			.expect.element('@firstItemFirstColumnValue').text.to.equal('e2e member');

		browser.adminUIListScreen
			.expect.element('@secondItemFirstColumnValue').to.be.visible;

		browser.adminUIListScreen
			.expect.element('@secondItemFirstColumnValue').text.to.equal('e2e user');
	},
	'List screen user item must have a value in the email column': function (browser) {
		browser.adminUIListScreen
			.expect.element('@firstItemSecondColumnValue').to.be.visible;

		browser.adminUIListScreen
			.expect.element('@firstItemSecondColumnValue').text.to.equal('member@test.e2e');

		browser.adminUIListScreen
			.expect.element('@secondItemSecondColumnValue').to.be.visible;

		browser.adminUIListScreen
			.expect.element('@secondItemSecondColumnValue').text.to.equal('user@test.e2e');
	},
	'List screen user item must have a value in the Is Admin column': function (browser) {
		browser.adminUIListScreen
			.expect.element('@firstItemThirdColumnValue').to.be.visible;

		browser.adminUIListScreen
			.expect.element('@secondItemThirdColumnValue').to.be.visible;
	},
	'List screen user item must be an Admin and not a Member': function (browser) {
		browser.adminUIListScreen
			.expect.element('@secondUserItemIsAdmin').to.be.visible;

		browser.adminUIListScreen
			.expect.element('@secondUserItemIsNotMember').to.be.visible;
	},
	'List screen member item must be a Member and not an Admin': function (browser) {
		browser.adminUIListScreen
			.expect.element('@firstUserItemIsMember').to.be.visible;

		browser.adminUIListScreen
			.expect.element('@firstUserItemIsNotAdmin').to.be.visible;
	},
};
