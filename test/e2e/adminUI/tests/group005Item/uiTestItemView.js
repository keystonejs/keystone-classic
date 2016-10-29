var ModelTestConfig = require('../../../modelTestConfig/UserModelTestConfig');

module.exports = {
	before: function (browser) {
		browser.adminUIApp = browser.page.adminUIApp();
		browser.adminUISigninScreen = browser.page.adminUISignin();
		browser.adminUIListScreen = browser.page.adminUIListScreen();
		browser.adminUIItemScreen = browser.page.adminUIItemScreen();

		browser.adminUIListScreen.setDefaultModelTestConfig(ModelTestConfig);

		browser.adminUIApp.gotoSigninScreen();
		browser.adminUISigninScreen.signin();

		browser.adminUIApp.openList({ section: 'access', list: 'User' });

		browser.adminUIListScreen.clickItemFieldValue({
			fields: [
				{ row: 2, column: 2, name: 'name', }
			],
		});

		browser.adminUIApp.waitForItemScreen();
	},
	after: function (browser) {
		browser.adminUIApp.signout();
		browser.end();
	},
	'Item screen should show a search input icon to search for list items': function (browser) {
		browser.adminUIItemScreen.assertElementIsVisible({ element: '@searchInputIcon' });
	},
	'Item screen should show breadcrumb links to go back to the origin list': function (browser) {
		browser.adminUIItemScreen.assertElementIsVisible({ element: '@listBreadcrumb' });
		browser.adminUIItemScreen.assertElementTextEquals({ element: '@listBreadcrumb', text: 'Users' });
	},
	'Item screen should show a + New <item> button to create new items': function (browser) {
		browser.adminUIItemScreen.assertElementIsVisible({ element: '@newItemButton' });
	},
	'Item screen should show an item name header': function (browser) {
		browser.adminUIItemScreen.assertElementIsVisible({ element: '@readOnlyNameHeader' });
		browser.adminUIItemScreen.assertElementTextEquals({ element: '@readOnlyNameHeader', text: 'e2e user' });
	},
	'Item screen should show an item id label': function (browser) {
		browser.adminUIItemScreen.assertElementIsVisible({ element: '@idLabel' });
	},
	'Item screen should show an item id value': function (browser) {
		browser.adminUIItemScreen.assertElementIsVisible({ element: '@idValue' });
	},
	'Item screen should show an item Meta header': function (browser) {
		browser.adminUIItemScreen.assertElementIsVisible({ element: '@metaHeader' });
		browser.adminUIItemScreen.assertElementTextEquals({ element: '@metaHeader', text: 'Meta' });
	},
	'Item screen should show an item meta Created On label': function (browser) {
		browser.adminUIItemScreen.assertElementIsVisible({ element: '@metaCreatedAtLabel' });
	},
	'Item screen should show an item meta Created On value': function (browser) {
		browser.adminUIItemScreen.assertElementIsVisible({ element: '@metaCreatedAtValue' });
	},
	// TODO:  The following are only testable with lists updated via a user session;
	//		  Currently the admin User is not created via a user session.
	//		  These assertions should be done by the fields!
	// 'Item screen should show an item meta Created By label': function (browser) {
	// 	browser.adminUIItemScreen.assertElementIsVisible({ element: '@metaCreatedByLabel'});
	// },
	// 'Item screen should show an item meta Created By value': function (browser) {
	// 	browser.adminUIItemScreen.assertElementIsVisible({ element: '@metaCreatedByValue'});
	// },
	// 'Item screen should show an item meta Updated By label': function (browser) {
	// 	browser.adminUIItemScreen.assertElementIsVisible({ element: '@metaUpdatedByLabel'});
	// },
	// 'Item screen should show an item meta Updated By value': function (browser) {
	// 	browser.adminUIItemScreen.assertElementIsVisible({ element: '@metaUpdatedByValue'});
	// },
	'Item screen should show an item save button': function (browser) {
		browser.adminUIItemScreen.assertElementIsVisible({ element: '@saveButton' });
		browser.adminUIItemScreen.assertElementTextEquals({ element: '@saveButton', text: 'Save' });
	},
	'Item screen should show an item reset button': function (browser) {
		browser.adminUIItemScreen.assertElementIsVisible({ element: '@resetButton' });
		browser.adminUIItemScreen.assertElementTextEquals({ element: '@resetButtonText', text: 'reset changes' });
	},
	'Item screen should show an item delete button': function (browser) {
		browser.adminUIItemScreen.assertElementIsVisible({ element: '@deleteButton' });
		browser.adminUIItemScreen.assertElementTextEquals({ element: '@deleteButtonText', text: 'delete user' });
	},
};
