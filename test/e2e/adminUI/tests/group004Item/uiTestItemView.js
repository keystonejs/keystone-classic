module.exports = {
	before: function (browser) {
		browser.app = browser.page.app();
		browser.signinPage = browser.page.signin();
		browser.listPage = browser.page.list();
		browser.itemPage = browser.page.item();
		browser.initialFormPage = browser.page.initialForm();
		browser.deleteConfirmationPage = browser.page.deleteConfirmation();

		browser.app.navigate();

		browser.app.waitForSigninScreen();

		browser.signinPage.signin();

		browser.app.waitForHomeScreen();

		browser.app.click('@accessMenu').waitForListScreen();

		browser.listPage.click('@secondItemLink');

		browser.app.waitForItemScreen();
	},
	after: function (browser) {
		browser.app.signout();
		browser.end();
	},
	'Item screen should show a search input icon to search for list items': function (browser) {
		browser.itemPage
			.expect.element('@searchInputIcon')
			.to.be.visible;
	},
	'Item screen should show breadcrumb links to go back to the origin list': function (browser) {
		browser.itemPage.expect.element('@listBreadcrumb')
			.to.be.visible;

		browser.itemPage.expect.element('@listBreadcrumb')
			.text.to.equal('Users');
	},
	'Item screen should show a + New <item> button to create new items': function (browser) {
		browser.itemPage
			.expect.element('@newItemButton')
			.to.be.visible;
	},
	'Item screen should show an item name header': function (browser) {
		browser.itemPage
			.expect.element('@readOnlyNameHeader')
			.to.be.visible;

		browser.itemPage
			.expect.element('@readOnlyNameHeader')
			.text.to.equal('e2e user');
	},
	'Item screen should show an item id label': function (browser) {
		browser.itemPage
			.expect.element('@idLabel')
			.to.be.visible;
	},
	'Item screen should show an item id value': function (browser) {
		browser.itemPage
			.expect.element('@idValue')
			.to.be.visible;
	},
	'Item screen should show an item Meta header': function (browser) {
		browser.itemPage
			.expect.element('@metaHeader')
			.to.be.visible;

		browser.itemPage
			.expect.element('@metaHeader')
			.text.to.equal('Meta');
	},
	'Item screen should show an item meta Created On label': function (browser) {
		browser.itemPage
			.expect.element('@metaCreatedOnLabel')
			.to.be.visible;
	},
	'Item screen should show an item meta Created On value': function (browser) {
		browser.itemPage
			.expect.element('@metaCreatedOnValue')
			.to.be.visible;
	},
	// TODO:  The following are only testable with lists updated via a user session;
	//		  Currently the admin User is not created via a user session.
	//		  These assertions should be done by the fields!
	// 'Item screen should show an item meta Created By label': function (browser) {
	// 	browser.itemPage
	// 		.expect.element('@metaCreatedByLabel')
	// 		.to.be.visible;
	// },
	// 'Item screen should show an item meta Created By value': function (browser) {
	// 	browser.itemPage
	// 		.expect.element('@metaCreatedByValue')
	// 		.to.be.visible;
	// },
	// 'Item screen should show an item meta Updated By label': function (browser) {
	// 	browser.itemPage
	// 		.expect.element('@metaUpdatedByLabel')
	// 		.to.be.visible;
	// },
	// 'Item screen should show an item meta Updated By value': function (browser) {
	// 	browser.itemPage
	// 		.expect.element('@metaUpdatedByValue')
	// 		.to.be.visible;
	// },
	'Item screen should show an item save button': function (browser) {
		browser.itemPage
			.expect.element('@saveButton')
			.to.be.visible;

		browser.itemPage
			.expect.element('@saveButton')
			.text.to.equal('Save');
	},
	'Item screen should show an item reset button': function (browser) {
		browser.itemPage
			.expect.element('@resetButton')
			.to.be.visible;

		browser.itemPage
			.expect.element('@resetButtonText')
			.text.to.equal('reset changes');
	},
	'Item screen should show an item delete button': function (browser) {
		browser.itemPage
			.expect.element('@deleteButton')
			.to.be.visible;

		browser.itemPage
			.expect.element('@deleteButtonText')
			.text.to.equal('delete user');
	},
};
