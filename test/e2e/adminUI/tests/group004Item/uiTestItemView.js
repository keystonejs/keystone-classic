var ModelTestConfig = require('../../../modelTestConfig/UserModelTestConfig');

module.exports = {
	before: function (browser) {
		browser.adminUIApp = browser.page.adminUIApp();
		browser.adminUISigninScreen = browser.page.adminUISignin();
		browser.adminUIListScreen = browser.page.adminUIListScreen();
		browser.adminUIItemScreen = browser.page.adminUIItemScreen();
		browser.adminUIInitialFormScreen = browser.page.adminUIInitialForm();
		browser.adminUIDeleteConfirmation = browser.page.adminUIDeleteConfirmation();

		browser.adminUIListScreen.setDefaultModelTestConfig(ModelTestConfig);

		browser.adminUIApp.gotoSigninScreen();

		browser.adminUIApp.waitForSigninScreen();

		browser.adminUISigninScreen.signin();

		browser.adminUIApp.waitForHomeScreen();

		browser.adminUIApp.openList({section: 'access', list: 'User'});

		browser.adminUIListScreen.clickItemFieldValue([
			{ row: 2, column: 2, name: 'name',}
		]);

		browser.adminUIApp.waitForItemScreen();
	},
	after: function (browser) {
		browser.adminUIApp.signout();
		browser.end();
	},
	'Item screen should show a search input icon to search for list items': function (browser) {
		browser.adminUIItemScreen
			.expect.element('@searchInputIcon')
			.to.be.visible;
	},
	'Item screen should show breadcrumb links to go back to the origin list': function (browser) {
		browser.adminUIItemScreen.expect.element('@listBreadcrumb')
			.to.be.visible;

		browser.adminUIItemScreen.expect.element('@listBreadcrumb')
			.text.to.equal('Users');
	},
	'Item screen should show a + New <item> button to create new items': function (browser) {
		browser.adminUIItemScreen
			.expect.element('@newItemButton')
			.to.be.visible;
	},
	'Item screen should show an item name header': function (browser) {
		browser.adminUIItemScreen
			.expect.element('@readOnlyNameHeader')
			.to.be.visible;

		browser.adminUIItemScreen
			.expect.element('@readOnlyNameHeader')
			.text.to.equal('e2e user');
	},
	'Item screen should show an item id label': function (browser) {
		browser.adminUIItemScreen
			.expect.element('@idLabel')
			.to.be.visible;
	},
	'Item screen should show an item id value': function (browser) {
		browser.adminUIItemScreen
			.expect.element('@idValue')
			.to.be.visible;
	},
	'Item screen should show an item Meta header': function (browser) {
		browser.adminUIItemScreen
			.expect.element('@metaHeader')
			.to.be.visible;

		browser.adminUIItemScreen
			.expect.element('@metaHeader')
			.text.to.equal('Meta');
	},
	'Item screen should show an item meta Created On label': function (browser) {
		browser.adminUIItemScreen
			.expect.element('@metaCreatedAtLabel')
			.to.be.visible;
	},
	'Item screen should show an item meta Created On value': function (browser) {
		browser.adminUIItemScreen
			.expect.element('@metaCreatedAtValue')
			.to.be.visible;
	},
	// TODO:  The following are only testable with lists updated via a user session;
	//		  Currently the admin User is not created via a user session.
	//		  These assertions should be done by the fields!
	// 'Item screen should show an item meta Created By label': function (browser) {
	// 	browser.adminUIItemScreen
	// 		.expect.element('@metaCreatedByLabel')
	// 		.to.be.visible;
	// },
	// 'Item screen should show an item meta Created By value': function (browser) {
	// 	browser.adminUIItemScreen
	// 		.expect.element('@metaCreatedByValue')
	// 		.to.be.visible;
	// },
	// 'Item screen should show an item meta Updated By label': function (browser) {
	// 	browser.adminUIItemScreen
	// 		.expect.element('@metaUpdatedByLabel')
	// 		.to.be.visible;
	// },
	// 'Item screen should show an item meta Updated By value': function (browser) {
	// 	browser.adminUIItemScreen
	// 		.expect.element('@metaUpdatedByValue')
	// 		.to.be.visible;
	// },
	'Item screen should show an item save button': function (browser) {
		browser.adminUIItemScreen
			.expect.element('@saveButton')
			.to.be.visible;

		browser.adminUIItemScreen
			.expect.element('@saveButton')
			.text.to.equal('Save');
	},
	'Item screen should show an item reset button': function (browser) {
		browser.adminUIItemScreen
			.expect.element('@resetButton')
			.to.be.visible;

		browser.adminUIItemScreen
			.expect.element('@resetButtonText')
			.text.to.equal('reset changes');
	},
	'Item screen should show an item delete button': function (browser) {
		browser.adminUIItemScreen
			.expect.element('@deleteButton')
			.to.be.visible;

		browser.adminUIItemScreen
			.expect.element('@deleteButtonText')
			.text.to.equal('delete user');
	},
};
