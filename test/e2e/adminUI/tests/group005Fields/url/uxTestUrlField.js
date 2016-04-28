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
		browser.app.signout();
		browser.end();
	},
	'Url field can be filled via the initial modal': function (browser) {
		browser.app
			.click('@fieldsMenu')
			.waitForElementVisible('@listScreen')
			.click('@urlsFieldsSubmenu')
			.waitForElementVisible('@listScreen');

		browser.listPage
			.click('@createFirstItemButton');

		browser.app
			.waitForElementVisible('@initialFormScreen');

		browser.initialFormPage.section.form.section.urlList.section.name
			.fillInput({value: 'Name Field Test 1'});

		browser.initialFormPage.section.form.section.urlList.section.name
			.verifyInput({value: 'Name Field Test 1'});

		browser.initialFormPage.section.form.section.urlList.section.fieldA
			.fillInput({value: 'www.example1.com'});

		browser.initialFormPage.section.form.section.urlList.section.fieldA
			.verifyInput({value: 'www.example1.com'});

		browser.initialFormPage.section.form
			.click('@createButton');

		browser.app
			.waitForElementVisible('@itemScreen');

		browser.itemPage
			.expect.element('@flashMessage')
			.text.to.equal('New Url Name Field Test 1 created.');

		browser.itemPage.section.form.section.urlList.section.name
			.verifyInput({value: 'Name Field Test 1'});

		browser.itemPage.section.form.section.urlList.section.fieldA
			.verifyInput({value: 'www.example1.com'});
	},
	'Url field can be filled via the edit form': function (browser) {
		browser.itemPage.section.form.section.urlList.section.fieldB
			.fillInput({value: 'www.example2.com'});

		browser.itemPage.section.form
			.click('@saveButton');

		browser.app
			.waitForElementVisible('@itemScreen');

		browser.itemPage
			.expect.element('@flashMessage')
			.text.to.equal('Your changes have been saved.');

		browser.itemPage.section.form.section.urlList.section.name
			.verifyInput({value: 'Name Field Test 1'});

		browser.itemPage.section.form.section.urlList.section.fieldB
			.verifyInput({value: 'www.example2.com'});
	},
	// UNDO ANY STATE CHANGES -- THIS TEST SHOULD RUN LAST
	'restoring test state': function (browser) {
	},
};
