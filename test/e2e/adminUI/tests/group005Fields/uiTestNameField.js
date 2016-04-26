module.exports = {
	before: function (browser) {
		browser
		browser.app = browser.page.app();
		browser.signinPage = browser.page.signin();
		browser.listPage = browser.page.list();
		browser.initialFormPage = browser.page.initialForm();

		browser.app.navigate();
		browser.app.waitForElementVisible('@signinPage');

		browser.signinPage.signin();
		browser.app.waitForElementVisible('@homePage');
	},
	after: function (browser) {
		browser.app.signout();
		browser.end();
	},
	'Name field should be visible in initial modal': function (browser) {
		browser.app
			.click('@fieldsMenu')
			.waitForElementVisible('@listPage')
			.click('@namesFieldsSubmenu')
			.waitForElementVisible('@listPage');

		browser.listPage
			.click('@createFirstItemButton');

		browser.app
			.waitForElementVisible('@initialFormPage');

		browser.initialFormPage.section.form.section.nameList.section.name
			.verifyUI();

		browser.initialFormPage.section.form.section.nameList.section.fieldA
			.verifyUI();
	},
	// UNDO ANY STATE CHANGES -- THIS TEST SHOULD RUN LAST
	'restoring test state': function (browser) {
		browser.initialFormPage.section.form
			.click('@cancelButton');

		browser.app
			.waitForElementVisible('@listPage');
	},
};
