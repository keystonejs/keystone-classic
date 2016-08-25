var NameModelTestConfig = require('../../../modelTestConfig/NameModelTestConfig');

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
	'List view should allow users to create a new list item': function (browser) {
		browser.adminUIApp
			.click('@fieldListsMenu')
			.waitForListScreen()
			.click('@nameListSubmenu')
			.waitForListScreen();

		browser.listScreen
			.click('@createFirstItemButton');

		browser.adminUIApp
			.waitForInitialFormScreen();

		browser.initialFormScreen.fillInputs({
			modelTestConfig: NameModelTestConfig,
			fields: {
				'name': {value: 'Name Field Test 1'},
				'fieldA': {firstName: 'First 1', lastName: 'Last 1'},
			}
		});

		browser.initialFormScreen.save();

		browser.adminUIApp
			.waitForItemScreen();

		browser.adminUIApp
			.click('@fieldListsMenu')
			.waitForListScreen()
			.click('@nameListSubmenu')
			.waitForListScreen();

		browser.listScreen
			.expect.element('@paginationCount').text.to.equal('Showing 1 Name');

		browser.listScreen
			.expect.element('@firstItemNameValue').text.to.equal('Name Field Test 1');
	},
	'List view should allow users to create more new list items': function (browser) {
		browser.adminUIApp
			.click('@fieldListsMenu')
			.waitForListScreen()
			.click('@nameListSubmenu')
			.waitForListScreen();

		browser.listScreen
			.click('@createMoreItemsButton');

		browser.adminUIApp
			.waitForInitialFormScreen();

		browser.initialFormScreen.fillInputs({
			modelTestConfig: NameModelTestConfig,
			fields: {
				'name': {value: 'Name Field Test 2'},
				'fieldA': {firstName: 'First 2', lastName: 'Last 2'},
			}
		});

		browser.initialFormScreen.section.form
			.click('@createButton');

		browser.adminUIApp
			.waitForItemScreen();

		browser.adminUIApp
			.click('@fieldListsMenu')
			.waitForListScreen()
			.click('@nameListSubmenu')
			.waitForListScreen();

		browser.listScreen
			.expect.element('@paginationCount').text.to.equal('Showing 2 Names');

		browser.listScreen
			.expect.element('@firstItemNameValue').text.to.equal('Name Field Test 1');

		browser.listScreen
			.expect.element('@secondItemNameValue').text.to.equal('Name Field Test 2');
	},
	'List view should allow users to browse an item by clicking the item name': function (browser) {
		browser.adminUIApp
			.click('@fieldListsMenu')
			.waitForListScreen()
			.click('@nameListSubmenu')
			.waitForListScreen();

		browser.listScreen
			.click('@firstItemNameValue');

		browser.adminUIApp
			.waitForItemScreen();
	},
	'List view should allow users to browse back to list view from an item view by using the crum links': function (browser) {
		browser.adminUIApp
			.click('@fieldListsMenu')
			.waitForListScreen()
			.click('@nameListSubmenu')
			.waitForListScreen();

		browser.listScreen
			.click('@firstItemNameValue');

		browser.adminUIApp
			.waitForItemScreen();

		browser.itemScreen
			.click('@listBreadcrumb');

		browser.adminUIApp
			.waitForListScreen();
	},
	'List view should allow users to search for items': function (browser) {
		browser.adminUIApp
			.click('@fieldListsMenu')
			.waitForListScreen()
			.click('@nameListSubmenu')
			.waitForListScreen();

		browser.listScreen
			.setValue('@searchInputField', 'Name Field Test 2');

		browser.adminUIApp
			.waitForListScreen();

		browser.listScreen
			.expect.element('@paginationCount').text.to.equal('Showing 1 Name');

		browser.listScreen
			.expect.element('@firstItemNameValue').text.to.equal('Name Field Test 2');
	},
	'List view should allow users to clear search filter': function (browser) {
		browser.listScreen
			.click('@searchInputFieldClearIcon');

		browser.adminUIApp
			.waitForListScreen();

		browser.listScreen
			.expect.element('@paginationCount').text.to.equal('Showing 2 Names');

		browser.listScreen
			.expect.element('@firstItemNameValue').text.to.equal('Name Field Test 1');

		browser.listScreen
			.expect.element('@secondItemNameValue').text.to.equal('Name Field Test 2');
	},
	'List view should allow users to delete items': function (browser) {
		browser.listScreen
			.click('@firstItemDeleteIcon');

		browser.adminUIApp
			.waitForDeleteConfirmationScreen();

		browser.deleteConfirmationScreen
			.click('@deleteButton');

		browser.adminUIApp
			.waitForListScreen();

		browser.listScreen
			.expect.element('@paginationCount').text.to.equal('Showing 1 Name');

		browser.listScreen
			.expect.element('@firstItemNameValue').text.to.equal('Name Field Test 2');
	},
	'List view should allow users to delete last item': function (browser) {
		browser.adminUIApp
			.click('@fieldListsMenu')
			.waitForListScreen()
			.click('@nameListSubmenu')
			.waitForListScreen();

		browser.listScreen
			.click('@firstItemDeleteIcon');

		browser.adminUIApp
			.waitForDeleteConfirmationScreen();

		browser.deleteConfirmationScreen
			.click('@deleteButton');

		browser.adminUIApp
			.waitForListScreen();

		browser.listScreen
			.expect.element('@noItemsFoundNoText').text.to.equal('No names found…');
	},

	// UNDO ANY STATE CHANGES -- THIS TEST SHOULD RUN LAST
	'List view ... resetting state changes': function (browser) {
	},
};
