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
	'Html field can be filled via the initial modal': function (browser) {
		browser.app
			.click('@fieldListsMenu')
			.waitForElementVisible('@listScreen')
			.click('@htmlListSubmenu')
			.waitForElementVisible('@listScreen');

		browser.listPage
			.click('@createFirstItemButton');

		browser.app
			.waitForElementVisible('@initialFormScreen');

		browser.initialFormPage.section.form.section.htmlList.section.name
			.fillInput({value: 'Html Field Test 1'});

		browser.initialFormPage.section.form.section.htmlList.section.name
			.verifyInput({value: 'Html Field Test 1'});

		browser.initialFormPage.section.form.section.htmlList.section.fieldA
			.fillInput({value: 'Test html code 1'});

		browser.initialFormPage.section.form.section.htmlList.section.fieldA
			.verifyInput({value: 'Test html code 1'});

		browser.initialFormPage.section.form
			.click('@createButton');

		browser.app
			.waitForElementVisible('@itemScreen');

		browser.itemPage
			.expect.element('@flashMessage')
			.text.to.equal('New Html Html Field Test 1 created.');

		browser.itemPage.section.form.section.htmlList.section.name
			.verifyInput({value: 'Html Field Test 1'});

		browser.itemPage.section.form.section.htmlList.section.fieldA
			.verifyInput({value: 'Test html code 1'});
	},
	'Html field can be filled via the edit form': function (browser) {
		browser.itemPage.section.form.section.htmlList.section.fieldB
			.fillInput({value: 'Test html code 2'});

		browser.itemPage.section.form
			.click('@saveButton');

		browser.app
			.waitForElementVisible('@itemScreen');

		browser.itemPage
			.expect.element('@flashMessage')
			.text.to.equal('Your changes have been saved.');

		browser.itemPage.section.form.section.htmlList.section.name
			.verifyInput({value: 'Html Field Test 1'});

		browser.itemPage.section.form.section.htmlList.section.fieldB
			.verifyInput({value: 'Test html code 2'});
	},
	// UNDO ANY STATE CHANGES -- THIS TEST SHOULD RUN LAST
	'restoring test state': function (browser) {
	},
};
