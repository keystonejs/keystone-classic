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
	'Date field can be filled via the initial modal': function (browser) {
		browser.app
			.click('@fieldListsMenu')
			.waitForElementVisible('@listScreen')
			.click('@dateListSubmenu')
			.waitForElementVisible('@listScreen');

		browser.listPage
			.click('@createFirstItemButton');

		browser.app
			.waitForElementVisible('@initialFormScreen');

		browser.initialFormPage.section.form.section.dateList.section.name
			.fillInput({value: 'Date Field Test 1'});

		browser.initialFormPage.section.form.section.dateList.section.name
			.verifyInput({value: 'Date Field Test 1'});

		browser.initialFormPage.section.form.section.dateList.section.fieldA
			.fillInput({value: '2016-01-01'});

		browser.initialFormPage.section.form.section.dateList.section.fieldA
			.verifyInput({value: '2016-01-01'});

		browser.initialFormPage.section.form
			.click('@createButton');

		browser.app
			.waitForElementVisible('@itemScreen');

		browser.itemPage
			.expect.element('@flashMessage')
			.text.to.equal('New Date Date Field Test 1 created.');

		browser.itemPage.section.form.section.dateList.section.name
			.verifyInput({value: 'Date Field Test 1'});

		browser.itemPage.section.form.section.dateList.section.fieldA
			.verifyInput({value: '2016-01-01'});
	},
	'Date field can be filled via the edit form': function (browser) {
		browser.itemPage.section.form.section.dateList.section.fieldB
			.fillInput({value: '2016-01-02'});

		browser.itemPage.section.form
			.click('@saveButton');

		browser.app
			.waitForElementVisible('@itemScreen');

		browser.itemPage
			.expect.element('@flashMessage')
			.text.to.equal('Your changes have been saved.');

		browser.itemPage.section.form.section.dateList.section.name
			.verifyInput({value: 'Date Field Test 1'});

		browser.itemPage.section.form.section.dateList.section.fieldB
			.verifyInput({value: '2016-01-02'});
	},
	// UNDO ANY STATE CHANGES -- THIS TEST SHOULD RUN LAST
	'restoring test state': function (browser) {
	},
};
