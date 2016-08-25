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

		browser.adminUIApp
			.waitForHomeScreen()
			.click('@accessMenu')
			.waitForListScreen();

		browser.listScreen.click('@secondItemLink');

		browser.adminUIApp.waitForItemScreen();
	},
	after: function (browser) {
		browser.adminUIApp.signout();
		browser.end();
	},
	'Item screen should show a search input icon to search for list items': function (browser) {
		browser.itemScreen
			.expect.element('@searchInputIcon')
			.to.be.visible;
	},
	'Item screen should show breadcrumb links to go back to the origin list': function (browser) {
		browser.itemScreen.expect.element('@listBreadcrumb')
			.to.be.visible;

		browser.itemScreen.expect.element('@listBreadcrumb')
			.text.to.equal('Users');
	},
	'Item screen should show a + New <item> button to create new items': function (browser) {
		browser.itemScreen
			.expect.element('@newItemButton')
			.to.be.visible;
	},
	'Item screen should show an item name header': function (browser) {
		browser.itemScreen
			.expect.element('@readOnlyNameHeader')
			.to.be.visible;

		browser.itemScreen
			.expect.element('@readOnlyNameHeader')
			.text.to.equal('e2e user');
	},
	'Item screen should show an item id label': function (browser) {
		browser.itemScreen
			.expect.element('@idLabel')
			.to.be.visible;
	},
	'Item screen should show an item id value': function (browser) {
		browser.itemScreen
			.expect.element('@idValue')
			.to.be.visible;
	},
	'Item screen should show an item Meta header': function (browser) {
		browser.itemScreen
			.expect.element('@metaHeader')
			.to.be.visible;

		browser.itemScreen
			.expect.element('@metaHeader')
			.text.to.equal('Meta');
	},
	'Item screen should show an item meta Created On label': function (browser) {
		browser.itemScreen
			.expect.element('@metaCreatedOnLabel')
			.to.be.visible;
	},
	'Item screen should show an item meta Created On value': function (browser) {
		browser.itemScreen
			.expect.element('@metaCreatedOnValue')
			.to.be.visible;
	},
	// TODO:  The following are only testable with lists updated via a user session;
	//		  Currently the admin User is not created via a user session.
	//		  These assertions should be done by the fields!
	// 'Item screen should show an item meta Created By label': function (browser) {
	// 	browser.itemScreen
	// 		.expect.element('@metaCreatedByLabel')
	// 		.to.be.visible;
	// },
	// 'Item screen should show an item meta Created By value': function (browser) {
	// 	browser.itemScreen
	// 		.expect.element('@metaCreatedByValue')
	// 		.to.be.visible;
	// },
	// 'Item screen should show an item meta Updated By label': function (browser) {
	// 	browser.itemScreen
	// 		.expect.element('@metaUpdatedByLabel')
	// 		.to.be.visible;
	// },
	// 'Item screen should show an item meta Updated By value': function (browser) {
	// 	browser.itemScreen
	// 		.expect.element('@metaUpdatedByValue')
	// 		.to.be.visible;
	// },
	'Item screen should show an item save button': function (browser) {
		browser.itemScreen
			.expect.element('@saveButton')
			.to.be.visible;

		browser.itemScreen
			.expect.element('@saveButton')
			.text.to.equal('Save');
	},
	'Item screen should show an item reset button': function (browser) {
		browser.itemScreen
			.expect.element('@resetButton')
			.to.be.visible;

		browser.itemScreen
			.expect.element('@resetButtonText')
			.text.to.equal('reset changes');
	},
	'Item screen should show an item delete button': function (browser) {
		browser.itemScreen
			.expect.element('@deleteButton')
			.to.be.visible;

		browser.itemScreen
			.expect.element('@deleteButtonText')
			.text.to.equal('delete user');
	},
};
