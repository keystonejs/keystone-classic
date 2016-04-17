module.exports = {
	before: function (browser) {
		browser.spa = browser.page.spa();
		browser.signinPage = browser.page.signin();
		browser.listPage = browser.page.list();
		browser.itemPage = browser.page.item();
		browser.initialFormPage = browser.page.initialForm();
		browser.deleteConfirmationPage = browser.page.deleteConfirmation();

		browser.spa.navigate();
		browser.spa.waitForElementVisible('@signinPage');

		browser.signinPage.signin();
		browser.spa.waitForElementVisible('@homePage');
	},
	after: function (browser) {
		browser.spa
			.signout();
		browser
			.end();
	},
	'List view should allow users to create a new list item': function (browser) {
		browser.spa
			.gotoListPage('names');

		browser.listPage
			.click('@createFirstItemButton');

		browser.spa
			.waitForElementVisible('@initialFormPage');

		browser.initialFormPage
			.fillNameListForm(browser.initialFormPage.section.form.section.nameList,'1');

		browser.spa
			.waitForElementVisible('@itemPage');

		browser.spa
			.gotoListPage('names');

		browser.listPage
			.expect.element('@paginationCount').text.to.equal('Showing 1 Name');

		browser.listPage
			.expect.element('@firstItemNameValue').text.to.equal('Name Field Test 1');
	},
	'List view should allow users to create more new list items': function (browser) {
		browser.spa
			.gotoListPage('names');

		browser.listPage
			.click('@createMoreItemsButton');

		browser.spa
			.waitForElementVisible('@initialFormPage');

		browser.initialFormPage
			.fillNameListForm(browser.initialFormPage.section.form.section.nameList,'2');

		browser.spa
			.waitForElementVisible('@itemPage');

		browser.spa
			.gotoListPage('names');

		browser.listPage
			.expect.element('@paginationCount').text.to.equal('Showing 2 Names');

		browser.listPage
			.expect.element('@firstItemNameValue').text.to.equal('Name Field Test 1');

		browser.listPage
			.expect.element('@secondItemNameValue').text.to.equal('Name Field Test 2');
	},
	'List view should allow users to browse an item by clicking the item name': function (browser) {
		browser.spa
			.gotoListPage('names');

		browser.listPage
			.click('@firstItemNameValue');

		browser.spa
			.waitForElementVisible('@itemPage');
	},
	'List view should allow users to browse back to list view from an item view by using the crum links': function (browser) {
		browser.spa
			.gotoListPage('names');

		browser.listPage
			.click('@firstItemNameValue');

		browser.spa
			.waitForElementVisible('@itemPage');

		browser.itemPage
			.click('@listBreadcrumb');

		browser.spa
			.waitForElementVisible('@listPage');
	},
	'List view should allow users to search for items': function (browser) {
		browser.spa
			.gotoListPage('names');

		browser.listPage
			.setValue('@searchInputField', 'Name Field Test 2');

		browser.spa
			.waitForElementVisible('@listPage');

		browser.listPage
			.expect.element('@paginationCount').text.to.equal('Showing 1 Name');

		browser.listPage
			.expect.element('@firstItemNameValue').text.to.equal('Name Field Test 2');
	},
	'List view should allow users to clear search filter': function (browser) {
		browser.listPage
			.click('@searchInputFieldClearIcon');

		browser.spa
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

		browser.spa
			.waitForElementVisible('@deleteConfirmationPage');

		browser.deleteConfirmationPage
			.click('@deleteButton');

		browser.spa
			.waitForElementVisible('@listPage');

		browser.listPage
			.expect.element('@paginationCount').text.to.equal('Showing 1 Name');

		browser.listPage
			.expect.element('@firstItemNameValue').text.to.equal('Name Field Test 2');
	},
	'List view should allow users to delete last item': function (browser) {
		browser.spa
			.gotoListPage('names');

		browser.listPage
			.click('@firstItemDeleteIcon');

		browser.spa
			.waitForElementVisible('@deleteConfirmationPage');

		browser.deleteConfirmationPage
			.click('@deleteButton');

		browser.spa
			.waitForElementVisible('@listPage');

		browser.listPage
			.expect.element('@noItemsFoundNoText').text.to.equal('No names found…');
	},

	// UNDO ANY STATE CHANGES -- THIS TEST SHOULD RUN LAST
	'List view ... resetting state changes': function (browser) {
	},
};
