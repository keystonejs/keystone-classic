module.exports = {
	before: function (browser) {
		browser.app = browser.page.app();
		browser.signinPage = browser.page.signin();
		browser.listPage = browser.page.list();
		browser.itemPage = browser.page.item();
		browser.initialFormPage = browser.page.initialForm();
		browser.deleteConfirmationPage = browser.page.deleteConfirmation();

		browser.app.navigate();
		browser.app.waitForElementVisible('@signinPage');

		browser.signinPage.signin();
		browser.app.waitForElementVisible('@homePage');
	},
	after: function (browser) {
		browser.app
			.signout();
		browser
			.end();
	},
	'List view should allow users to create a new list item': function (browser) {
		browser.app
			.gotoListPage('names');

		browser.listPage
			.click('@createFirstItemButton');

		browser.app
			.waitForElementVisible('@initialFormPage');

		browser.initialFormPage.section.form.section.nameList.section.nameField
			.fillInput({value: 'Name Field Test 1'});

		browser.initialFormPage.section.form.section.nameList.section.nameField
			.verifyInput({value: 'Name Field Test 1'});

		browser.initialFormPage.section.form.section.nameList.section.fieldA
			.fillInput({firstName: 'First 1', lastName: 'Last 1'});

		browser.initialFormPage.section.form
			.click('@createButton');

		browser.app
			.waitForElementVisible('@itemPage');

		browser.app
			.gotoListPage('names');

		browser.listPage
			.expect.element('@paginationCount').text.to.equal('Showing 1 Name');

		browser.listPage
			.expect.element('@firstItemNameValue').text.to.equal('Name Field Test 1');
	},
	'List view should allow users to create more new list items': function (browser) {
		browser.app
			.gotoListPage('names');

		browser.listPage
			.click('@createMoreItemsButton');

		browser.app
			.waitForElementVisible('@initialFormPage');

		browser.initialFormPage.section.form.section.nameList.section.nameField
			.fillInput({value: 'Name Field Test 2'});

		browser.initialFormPage.section.form.section.nameList.section.nameField
			.verifyInput({value: 'Name Field Test 2'});

		browser.initialFormPage.section.form.section.nameList.section.fieldA
			.fillInput({firstName: 'First 2', lastName: 'Last 2'});

		browser.initialFormPage.section.form
			.click('@createButton');

		browser.app
			.waitForElementVisible('@itemPage');

		browser.app
			.gotoListPage('names');

		browser.listPage
			.expect.element('@paginationCount').text.to.equal('Showing 2 Names');

		browser.listPage
			.expect.element('@firstItemNameValue').text.to.equal('Name Field Test 1');

		browser.listPage
			.expect.element('@secondItemNameValue').text.to.equal('Name Field Test 2');
	},
	'List view should allow users to browse an item by clicking the item name': function (browser) {
		browser.app
			.gotoListPage('names');

		browser.listPage
			.click('@firstItemNameValue');

		browser.app
			.waitForElementVisible('@itemPage');
	},
	'List view should allow users to browse back to list view from an item view by using the crum links': function (browser) {
		browser.app
			.gotoListPage('names');

		browser.listPage
			.click('@firstItemNameValue');

		browser.app
			.waitForElementVisible('@itemPage');

		browser.itemPage
			.click('@listBreadcrumb');

		browser.app
			.waitForElementVisible('@listPage');
	},
	'List view should allow users to search for items': function (browser) {
		browser.app
			.gotoListPage('names');

		browser.listPage
			.setValue('@searchInputField', 'Name Field Test 2');

		browser.app
			.waitForElementVisible('@listPage');

		browser.listPage
			.expect.element('@paginationCount').text.to.equal('Showing 1 Name');

		browser.listPage
			.expect.element('@firstItemNameValue').text.to.equal('Name Field Test 2');
	},
	'List view should allow users to clear search filter': function (browser) {
		browser.listPage
			.click('@searchInputFieldClearIcon');

		browser.app
			.waitForElementVisible('@listPage');

		browser.listPage
			.expect.element('@paginationCount').text.to.equal('Showing 2 Names');

		browser.listPage
			.expect.element('@firstItemNameValue').text.to.equal('Name Field Test 1');

		browser.listPage
			.expect.element('@secondItemNameValue').text.to.equal('Name Field Test 2');
	},
	'List view should allow users to delete items': function (browser) {
		browser.listPage
			.click('@firstItemDeleteIcon');

		browser.app
			.waitForElementVisible('@deleteConfirmationPage');

		browser.deleteConfirmationPage
			.click('@deleteButton');

		browser.app
			.waitForElementVisible('@listPage');

		browser.listPage
			.expect.element('@paginationCount').text.to.equal('Showing 1 Name');

		browser.listPage
			.expect.element('@firstItemNameValue').text.to.equal('Name Field Test 2');
	},
	'List view should allow users to delete last item': function (browser) {
		browser.app
			.gotoListPage('names');

		browser.listPage
			.click('@firstItemDeleteIcon');

		browser.app
			.waitForElementVisible('@deleteConfirmationPage');

		browser.deleteConfirmationPage
			.click('@deleteButton');

		browser.app
			.waitForElementVisible('@listPage');

		browser.listPage
			.expect.element('@noItemsFoundNoText').text.to.equal('No names found…');
	},

	// UNDO ANY STATE CHANGES -- THIS TEST SHOULD RUN LAST
	'List view ... resetting state changes': function (browser) {
	},
};
