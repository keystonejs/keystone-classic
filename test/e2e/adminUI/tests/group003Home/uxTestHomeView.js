var NameModelTestConfig = require('../../../modelTestConfig/NameModelTestConfig');

module.exports = {
	before: function (browser) {
		browser.adminUIApp = browser.page.adminUIApp();
		browser.adminUISigninScreen = browser.page.adminUISignin();
		browser.adminUIHomeScreen = browser.page.adminUIHomeScreen();
		browser.adminUIInitialFormScreen = browser.page.adminUIInitialForm();
		browser.adminUIListScreen = browser.page.adminUIListScreen();
		browser.adminUIDeleteConfirmation = browser.page.adminUIDeleteConfirmation();

		browser.adminUIApp.gotoSigninScreen();
		browser.adminUISigninScreen.signin();
	},
	after: function (browser) {
		browser.adminUIApp.signout();
		browser.end();
	},
	'Home view should allow navigating to a list of items': function (browser) {
		browser.adminUIHomeScreen.openList({ groupName: 'Access', listName: 'User' });
	},
	'Home view should allow clicking a card list item such as Users to should show the list of those items': function (browser) {
		browser.adminUIApp.gotoHomeScreen();

		browser.adminUIHomeScreen
			.configureTabUI({
				groupName: 'Access',
				tabs: [
					{ listName: 'User', items: '2 Items' }
				],
			})
			.clickTabUI({
				groupName: 'Access',
				tabListName: 'User',
				click: 'tabLabel',
			})
	},
	'Home view should allow an admin to create a new list item such as a user': function (browser) {
		browser.adminUIApp.gotoHomeScreen();

		browser.adminUIHomeScreen
			.configureTabUI({
				groupName: 'Access',
				tabs: [
					{ listName: 'User', items: '2 Items' }
				],
			})
			.clickTabUI({
				groupName: 'Access',
				tabListName: 'User',
				click: 'tabPlusIconLink',
			});
	},
	'Home view should allow an admin to create a new list item and increment the item count': function (browser) {
		browser.adminUIApp.gotoHomeScreen();

		browser.adminUIHomeScreen
			.configureTabUI({
				groupName: 'Fields',
				tabs: [
					{ listName: 'Name', items: '0 Items' },
				],
			})
			.assertTabTextEquals({ groupName: 'Fields' })
			.clickTabUI({
				groupName: 'Fields',
				tabListName: 'Name',
				click: 'tabPlusIconLink',
			});

		browser.adminUIInitialFormScreen.fillFieldInputs({
			fields: [
				{ name: 'name', input: { value: 'Name Field Test' }, modelTestConfig: NameModelTestConfig, },
				{ name: 'fieldA', input: { firstName: 'First', lastName: 'Last' }, modelTestConfig: NameModelTestConfig, },
			],
		});

		browser.adminUIInitialFormScreen.save();

		browser.adminUIApp.waitForItemScreen();
		browser.adminUIApp.gotoHomeScreen();

		browser.adminUIHomeScreen
			.configureTabUI({
				groupName: 'Fields',
				tabs: [
					{ listName: 'Name', items: '1 Item' },
				],
			})
			.assertTabTextEquals({ groupName: 'Fields' });
	},
	// UNDO ANY STATE CHANGES -- THIS TEST SHOULD RUN LAST
	'Home view ... undoing any state changes': function (browser) {
		// Delete the Name Field added
		browser.adminUIApp.gotoHomeScreen();

		browser.adminUIApp.openList({ section: 'Fields', list: 'Name' });

		browser.adminUIListScreen.clickDeleteItemIcon({
			icons: [
				{ row: 1, column: 1 }
			],
		})

		browser.adminUIApp.waitForDeleteConfirmationScreen();

		browser.adminUIDeleteConfirmation
			.click('@deleteButton');

		browser.adminUIApp.waitForListScreen();
	},
};
