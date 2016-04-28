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
	'Textarea field can be filled via the initial modal': function (browser) {
		browser.app
			.click('@fieldsMenu')
			.waitForElementVisible('@listScreen')
			.click('@textareasFieldsSubmenu')
			.waitForElementVisible('@listScreen');

		browser.listPage
			.click('@createFirstItemButton');

		browser.app
			.waitForElementVisible('@initialFormScreen');

		browser.initialFormPage.section.form.section.textList.section.name
			.fillInput({value: 'Name Field Test 1'});

		browser.initialFormPage.section.form.section.textList.section.name
			.verifyInput({value: 'Name Field Test 1'});

		browser.initialFormPage.section.form.section.textareaList.section.fieldA
			.fillInput({value: 'Textarea Field Test 1'});

		browser.initialFormPage.section.form.section.textareaList.section.fieldA
			.verifyInput({value: 'Textarea Field Test 1'});

		browser.initialFormPage.section.form
			.click('@createButton');

		browser.app
			.waitForElementVisible('@itemScreen');

		browser.itemPage
			.expect.element('@flashMessage')
			.text.to.equal('New Textarea Name Field Test 1 created.');

		browser.itemPage.section.form.section.textList.section.name
			.verifyInput({value: 'Name Field Test 1'});

		browser.itemPage.section.form.section.textareaList.section.fieldA
			.verifyInput({value: 'Textarea Field Test 1'});
	},
	'Textarea field can be filled via the edit form': function (browser) {
		browser.itemPage.section.form.section.textareaList.section.fieldB
			.fillInput({value: 'Textarea Field Test 2'});

		browser.itemPage.section.form
			.click('@saveButton');

		browser.app
			.waitForElementVisible('@itemScreen');

		browser.itemPage
			.expect.element('@flashMessage')
			.text.to.equal('Your changes have been saved.');

		browser.itemPage.section.form.section.textList.section.name
			.verifyInput({value: 'Name Field Test 1'});

		browser.itemPage.section.form.section.textareaList.section.fieldB
			.verifyInput({value: 'Textarea Field Test 2'});
	},
	// UNDO ANY STATE CHANGES -- THIS TEST SHOULD RUN LAST
	'restoring test state': function (browser) {
	},
};
