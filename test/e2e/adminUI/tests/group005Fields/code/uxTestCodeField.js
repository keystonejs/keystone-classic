var adminUI = require('../../../adminUI');

module.exports = {
	before: function (browser) {
		browser.app = browser.page.app();
		browser.signinPage = browser.page.signin();
		browser.listPage = browser.page.list();
		browser.itemPage = browser.page.item();
		browser.initialFormPage = browser.page.initialForm();

		browser.app.navigate();
		browser.app.waitForElementVisible('@signinScreen');

		browser.signinPage.signin();
		browser.app.waitForElementVisible('@homeScreen');
	},
	after: function (browser) {
		browser.app
			.signout();
		browser
			.end();
	},
	'Code field can be created via the initial modal': function (browser) {
		browser.app
			.click('@fieldsMenu')
			.waitForElementVisible('@listScreen')
			.click('@codesFieldsSubmenu')
			.waitForElementVisible('@listScreen');

		browser.listPage
			.click('@createFirstItemButton');

		browser.app
			.waitForElementVisible('@initialFormScreen');

		browser.initialFormPage.section.form.section.codeList.section.name
			.fillInput({value: 'Name Field Test 1'});

		browser.initialFormPage.section.form.section.codeList.section.name
			.verifyInput({value: 'Name Field Test 1'});

		browser.initialFormPage.section.form.section.codeList.section.fieldA
			.fillInput({value: 'Some Test Code for Field A'});

		browser.initialFormPage.section.form
			.click('@createButton');

		browser.app
			.waitForElementVisible('@itemScreen');

		browser.itemPage
			.expect.element('@flashMessage')
			.text.to.equal('New Code Name Field Test 1 created.');

		browser.itemPage.section.form.section.codeList.section.name
			.verifyInput({value: 'Name Field Test 1'});

		browser.itemPage.section.form.section.codeList.section.fieldA
			.verifyInput({value: 'Some Test Code for Field A'});
	},
	'Code field can be created via the edit form': function (browser) {
		browser.itemPage.section.form.section.codeList.section.fieldB
			.fillInput({value: 'Some Test Code for Field B'});

		browser.itemPage.section.form
			.click('@saveButton');

		browser.app
			.waitForElementVisible('@itemScreen');

		browser.itemPage
			.expect.element('@flashMessage')
			.text.to.equal('Your changes have been saved.');

		browser.itemPage.section.form.section.codeList.section.name
			.verifyInput({value: 'Name Field Test 1'});

		browser.itemPage.section.form.section.codeList.section.fieldB
			.verifyInput({value: 'Some Test Code for Field B'});
	},
	// UNDO ANY STATE CHANGES -- THIS TEST SHOULD RUN LAST
	'restoring test state': function (browser) {
	},
};
