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
	'Text field can be filled via the initial modal': function (browser) {
		browser.app
			.click('@fieldListsMenu')
			.waitForElementVisible('@listScreen')
			.click('@textListSubmenu')
			.waitForElementVisible('@listScreen');

		browser.listPage
			.click('@createFirstItemButton');

		browser.app
			.waitForElementVisible('@initialFormScreen');

		browser.initialFormPage.section.form.section.textList.section.name
			.fillInput({value: 'Text Field Test 1'});

		browser.initialFormPage.section.form.section.textList.section.name
			.verifyInput({value: 'Text Field Test 1'});

		browser.initialFormPage.section.form.section.textList.section.fieldA
			.fillInput({value: 'Text Field Test Text 1'});

		browser.initialFormPage.section.form
			.click('@createButton');

		browser.app
			.waitForElementVisible('@itemScreen');

		browser.itemPage
			.expect.element('@flashMessage')
			.text.to.equal('New Text Text Field Test 1 created.');

		browser.itemPage.section.form.section.textList.section.name
			.verifyInput({value: 'Text Field Test 1'});
	},
	'Text field can be filled via the edit form': function (browser) {
		browser.itemPage.section.form.section.textList.section.name
			.fillInput({value: 'Text Field Test 2'});

		browser.itemPage.section.form.section.textList.section.fieldA
			.fillInput({value: 'Text Field Test Text 2'});

		browser.itemPage.section.form
			.click('@saveButton');

		browser.itemPage
			.waitForElementVisible('@flashMessage');

		browser.itemPage
			.expect.element('@flashMessage').text.to.equal('Your changes have been saved.');

		browser.itemPage.section.form.section.textList.section.name
			.verifyInput({value: 'Text Field Test 2'});

		browser.itemPage.section.form.section.textList.section.fieldA
			.verifyInput({value: 'Text Field Test Text 2'});
	},
};
