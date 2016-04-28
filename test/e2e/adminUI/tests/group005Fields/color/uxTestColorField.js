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
	'Color field can be filled via the initial modal': function (browser) {
		browser.app
			.click('@fieldsMenu')
			.waitForElementVisible('@listScreen')
			.click('@colorsFieldsSubmenu')
			.waitForElementVisible('@listScreen');

		browser.listPage
			.click('@createFirstItemButton');

		browser.app
			.waitForElementVisible('@initialFormScreen');

		browser.initialFormPage.section.form.section.colorList.section.name
			.fillInput({value: 'Name Field Test 1'});

		browser.initialFormPage.section.form.section.colorList.section.name
			.verifyInput({value: 'Name Field Test 1'});

		browser.initialFormPage.section.form.section.colorList.section.fieldA
			.fillInput({value: '#002147'});

		browser.initialFormPage.section.form.section.colorList.section.fieldA
			.verifyInput({value: '#002147'});

		browser.initialFormPage.section.form
			.click('@createButton');

		browser.app
			.waitForElementVisible('@itemScreen');

		browser.itemPage
			.expect.element('@flashMessage')
			.text.to.equal('New Color Name Field Test 1 created.');

		browser.itemPage.section.form.section.colorList.section.name
			.verifyInput({value: 'Name Field Test 1'});

		browser.itemPage.section.form.section.colorList.section.fieldA
			.verifyInput({value: '#002147'});
	},
	'Color field can be filled via the edit form': function (browser) {
		browser.itemPage.section.form.section.colorList.section.fieldB
			.fillInput({value: '#f8e71c'});

		browser.itemPage.section.form
			.click('@saveButton');

		browser.app
			.waitForElementVisible('@itemScreen');

		browser.itemPage
			.expect.element('@flashMessage')
			.text.to.equal('Your changes have been saved.');

		browser.itemPage.section.form.section.colorList.section.name
			.verifyInput({value: 'Name Field Test 1'});

		browser.itemPage.section.form.section.colorList.section.fieldB
			.verifyInput({value: '#f8e71c'});
	},
	// UNDO ANY STATE CHANGES -- THIS TEST SHOULD RUN LAST
	'restoring test state': function (browser) {
	},
};
