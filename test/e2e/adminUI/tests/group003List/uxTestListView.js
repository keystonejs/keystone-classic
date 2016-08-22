module.exports = {
	before: function (browser) {
		browser.app = browser.page.app();
		browser.signinScreen = browser.page.signin();
		browser.listScreen = browser.page.list();
		browser.itemScreen = browser.page.item();
		browser.initialFormScreen = browser.page.initialForm();
		browser.deleteConfirmationScreen = browser.page.deleteConfirmation();

		browser.app
			.gotoHomeScreen()
			.waitForSigninScreen();

		browser.signinScreen.signin();

		browser.app.waitForHomeScreen();
	},
	after: function (browser) {
		browser.app.signout();
		browser.end();
	},
	'List view should allow users to create a new list item': function (browser) {
		browser.app
			.click('@fieldListsMenu')
			.waitForListScreen()
			.click('@nameListSubmenu')
			.waitForListScreen();

		browser.listScreen
			.click('@createFirstItemButton');

		browser.app
			.waitForInitialFormScreen();

		browser.initialFormScreen.section.form.section.nameList.section.name
			.fillInput({value: 'Name Field Test 1'});

		browser.initialFormScreen.section.form.section.nameList.section.name
			.assertInput({value: 'Name Field Test 1'});

		browser.initialFormScreen.section.form.section.nameList.section.fieldA
			.fillInput({firstName: 'First 1', lastName: 'Last 1'});

		browser.initialFormScreen.section.form
			.click('@createButton');

		browser.app
			.waitForItemScreen();

		browser.app
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
		browser.app
			.click('@fieldListsMenu')
			.waitForListScreen()
			.click('@nameListSubmenu')
			.waitForListScreen();

		browser.listScreen
			.click('@createMoreItemsButton');

		browser.app
			.waitForInitialFormScreen();

		browser.initialFormScreen.section.form.section.nameList.section.name
			.fillInput({value: 'Name Field Test 2'});

		browser.initialFormScreen.section.form.section.nameList.section.name
			.assertInput({value: 'Name Field Test 2'});

		browser.initialFormScreen.section.form.section.nameList.section.fieldA
			.fillInput({firstName: 'First 2', lastName: 'Last 2'});

		browser.initialFormScreen.section.form
			.click('@createButton');

		browser.app
			.waitForItemScreen();

		browser.app
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
		browser.app
			.click('@fieldListsMenu')
			.waitForListScreen()
			.click('@nameListSubmenu')
			.waitForListScreen();

		browser.listScreen
			.click('@firstItemNameValue');

		browser.app
			.waitForItemScreen();
	},
	'List view should allow users to browse back to list view from an item view by using the crum links': function (browser) {
		browser.app
			.click('@fieldListsMenu')
			.waitForListScreen()
			.click('@nameListSubmenu')
			.waitForListScreen();

		browser.listScreen
			.click('@firstItemNameValue');

		browser.app
			.waitForItemScreen();

		browser.itemScreen
			.click('@listBreadcrumb');

		browser.app
			.waitForListScreen();
	},
	'List view should allow users to search for items': function (browser) {
		browser.app
			.click('@fieldListsMenu')
			.waitForListScreen()
			.click('@nameListSubmenu')
			.waitForListScreen();

		browser.listScreen
			.setValue('@searchInputField', 'Name Field Test 2');

		browser.app
			.waitForListScreen();

		browser.listScreen
			.expect.element('@paginationCount').text.to.equal('Showing 1 Name');

		browser.listScreen
			.expect.element('@firstItemNameValue').text.to.equal('Name Field Test 2');
	},
	'List view should allow users to clear search filter': function (browser) {
		browser.listScreen
			.click('@searchInputFieldClearIcon');

		browser.app
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

		browser.app
			.waitForDeleteConfirmationScreen();

		browser.deleteConfirmationScreen
			.click('@deleteButton');

		browser.app
			.waitForListScreen();

		browser.listScreen
			.expect.element('@paginationCount').text.to.equal('Showing 1 Name');

		browser.listScreen
			.expect.element('@firstItemNameValue').text.to.equal('Name Field Test 2');
	},
	'List view should allow users to delete last item': function (browser) {
		browser.app
			.click('@fieldListsMenu')
			.waitForListScreen()
			.click('@nameListSubmenu')
			.waitForListScreen();

		browser.listScreen
			.click('@firstItemDeleteIcon');

		browser.app
			.waitForDeleteConfirmationScreen();

		browser.deleteConfirmationScreen
			.click('@deleteButton');

		browser.app
			.waitForListScreen();

		browser.listScreen
			.expect.element('@noItemsFoundNoText').text.to.equal('No names found…');
	},

	// UNDO ANY STATE CHANGES -- THIS TEST SHOULD RUN LAST
	'List view ... resetting state changes': function (browser) {
	},
};
