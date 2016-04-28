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
	'Select field can be filled via the initial modal': function (browser) {
		browser.app
			.click('@fieldsMenu')
			.waitForElementVisible('@listScreen')
			.click('@selectsFieldsSubmenu')
			.waitForElementVisible('@listScreen');

		browser.listPage
			.click('@createFirstItemButton');

		browser.app
			.waitForElementVisible('@initialFormScreen');

		browser.initialFormPage.section.form.section.selectList.section.name
			.fillInput({value: 'Name Field Test 1'});

		browser.initialFormPage.section.form.section.selectList.section.name
			.verifyInput({value: 'Name Field Test 1'});

		browser.initialFormPage.section.form.section.selectList.section.fieldA
			.fillInput({value: ''});

		browser.initialFormPage.section.form.section.selectList.section.fieldA
			.verifyInput({value: 'One'});

		browser.initialFormPage.section.form
			.click('@createButton');

		browser.app
			.waitForElementVisible('@itemScreen');

		browser.itemPage
			.expect.element('@flashMessage')
			.text.to.equal('New Select Name Field Test 1 created.');

		browser.itemPage.section.form.section.selectList.section.name
			.verifyInput({value: 'Name Field Test 1'});

		browser.itemPage.section.form.section.selectList.section.fieldA
			.verifyInput({value: 'One'});
	},
	'Select field can be filled via the edit form': function (browser) {
		browser.itemPage.section.form.section.selectList.section.fieldB
			.fillInput({value: 'Two'});

		browser.itemPage.section.form
			.click('@saveButton');

		browser.app
			.waitForElementVisible('@itemScreen');

		browser.itemPage
			.expect.element('@flashMessage')
			.text.to.equal('Your changes have been saved.');

		browser.itemPage.section.form.section.selectList.section.name
			.verifyInput({value: 'Name Field Test 1'});

		browser.itemPage.section.form.section.selectList.section.fieldB
			.verifyInput({value: 'Two'});
	},
	// UNDO ANY STATE CHANGES -- THIS TEST SHOULD RUN LAST
	'restoring test state': function (browser) {
	},
};
