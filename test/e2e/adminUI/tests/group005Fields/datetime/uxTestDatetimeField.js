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
	'Datetime field can be filled via the initial modal': function (browser) {
		browser.app
			.click('@fieldListsMenu')
			.waitForElementVisible('@listScreen')
			.click('@datetimeListSubmenu')
			.waitForElementVisible('@listScreen');

		browser.listPage
			.click('@createFirstItemButton');

		browser.app
			.waitForElementVisible('@initialFormScreen');

		browser.initialFormPage.section.form.section.datetimeList.section.name
			.fillInput({value: 'Datetime Field Test 1'});

		browser.initialFormPage.section.form.section.datetimeList.section.name
			.verifyInput({value: 'Datetime Field Test 1'});

		browser.initialFormPage.section.form.section.datetimeList.section.fieldA
			.fillInput({date: '2016-01-01', time: '12:00:00 am'});

		browser.initialFormPage.section.form.section.datetimeList.section.fieldA
			.verifyInput({date: '2016-01-01', time: '12:00:00 am'});

		browser.initialFormPage.section.form
			.click('@createButton');

		browser.app
			.waitForElementVisible('@itemScreen');

		browser.itemPage
			.expect.element('@flashMessage')
			.text.to.equal('New Datetime Datetime Field Test 1 created.');

		browser.itemPage.section.form.section.datetimeList.section.name
			.verifyInput({value: 'Datetime Field Test 1'});

		browser.itemPage.section.form.section.datetimeList.section.fieldA
			.verifyInput({date: '2016-01-01', time: '12:00:00 am'});
	},
	'Datetime field can be filled via the edit form': function (browser) {
		// Commented out pending a fix for issue #2715
		// browser.itemPage.section.form.section.datetimeList.section.fieldB
		// 	.fillInput({date: '2016-01-02', time: '12:00:00 am'});


		browser.itemPage.section.form
			.click('@saveButton');

		browser.app
			.waitForElementVisible('@itemScreen');

		browser.itemPage
			.expect.element('@flashMessage')
			.text.to.equal('Your changes have been saved.');

		browser.itemPage.section.form.section.datetimeList.section.name
			.verifyInput({value: 'Datetime Field Test 1'});

		// Commented out pending a fix for issue #2715
		// browser.itemPage.section.form.section.datetimeList.section.fieldB
		//	.verifyInput({date: '2016-01-02', time: '12:00:00 am'});
	},
	// UNDO ANY STATE CHANGES -- THIS TEST SHOULD RUN LAST
	'restoring test state': function (browser) {
	},
};
