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
		browser.adminUISigninScreen.signin();

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
		browser.adminUIItemScreen.assertElementIsVisible('searchInputIcon');
	},
	'Item screen should show breadcrumb links to go back to the origin list': function (browser) {
		browser.adminUIItemScreen.assertElementIsVisible('listBreadcrumb');
		browser.adminUIItemScreen.assertElementTextEquals('listBreadcrumb', 'Users');
	},
	'Item screen should show a + New <item> button to create new items': function (browser) {
		browser.adminUIItemScreen.assertElementIsVisible('newItemButton');
	},
	'Item screen should show an item name header': function (browser) {
		browser.adminUIItemScreen.assertElementIsVisible('readOnlyNameHeader');
		browser.adminUIItemScreen.assertElementTextEquals('readOnlyNameHeader', 'e2e user');
	},
	'Item screen should show an item id label': function (browser) {
		browser.adminUIItemScreen.assertElementIsVisible('idLabel');
	},
	'Item screen should show an item id value': function (browser) {
		browser.adminUIItemScreen.assertElementIsVisible('idValue');
	},
	'Item screen should show an item Meta header': function (browser) {
		browser.adminUIItemScreen.assertElementIsVisible('metaHeader');
		browser.adminUIItemScreen.assertElementTextEquals('metaHeader', 'Meta');
	},
	'Item screen should show an item meta Created On label': function (browser) {
		browser.adminUIItemScreen.assertElementIsVisible('metaCreatedAtLabel');
	},
	'Item screen should show an item meta Created On value': function (browser) {
		browser.adminUIItemScreen.assertElementIsVisible('metaCreatedAtValue');
	},
	// TODO:  The following are only testable with lists updated via a user session;
	//		  Currently the admin User is not created via a user session.
	//		  These assertions should be done by the fields!
	// 'Item screen should show an item meta Created By label': function (browser) {
	// 	browser.adminUIItemScreen.assertElementIsVisible('metaCreatedByLabel');
	// },
	// 'Item screen should show an item meta Created By value': function (browser) {
	// 	browser.adminUIItemScreen.assertElementIsVisible('metaCreatedByValue');
	// },
	// 'Item screen should show an item meta Updated By label': function (browser) {
	// 	browser.adminUIItemScreen.assertElementIsVisible('metaUpdatedByLabel');
	// },
	// 'Item screen should show an item meta Updated By value': function (browser) {
	// 	browser.adminUIItemScreen.assertElementIsVisible('metaUpdatedByValue');
	// },
	'Item screen should show an item save button': function (browser) {
		browser.adminUIItemScreen.assertElementIsVisible('saveButton');
		browser.adminUIItemScreen.assertElementTextEquals('saveButton', 'Save');
	},
	'Item screen should show an item reset button': function (browser) {
		browser.adminUIItemScreen.assertElementIsVisible('resetButton');
		browser.adminUIItemScreen.assertElementTextEquals('resetButtonText', 'reset changes');
	},
	'Item screen should show an item delete button': function (browser) {
		browser.adminUIItemScreen.assertElementIsVisible('deleteButton');
		browser.adminUIItemScreen.assertElementTextEquals('deleteButtonText', 'delete user');
	},
};
