module.exports = {
	beforeUI: function (browser) {
		browser
		browser.app = browser.page.app();
		browser.signinPage = browser.page.signin();
		browser.listPage = browser.page.list();
		browser.initialFormPage = browser.page.initialForm();

		browser.app.navigate();
		browser.app.waitForElementVisible('@signinScreen');

		browser.signinPage.signin();
		browser.app.waitForElementVisible('@homeScreen');
	},
	beforeUX: function (browser) {
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
	assertInitialFormUI: function (name) {
		var nameLowercase = name.toLowerCase();
		return function (browser) {
			browser.app
				.click('@fieldListsMenu')
				.waitForElementVisible('@listScreen')
				.click('@' + nameLowercase + 'ListSubmenu')
				.waitForElementVisible('@listScreen');

			browser.listPage
				.click('@createFirstItemButton');

			browser.app
				.waitForElementVisible('@initialFormScreen');

			browser.initialFormPage.section.form.section[ nameLowercase + 'List' ].section.name
				.verifyUI();

			browser.initialFormPage.section.form.section[ nameLowercase + 'List' ].section.fieldA
				.verifyUI();
		}
	},
	assertInitialFormUX: function(name, testInputArray){
		var nameLowercase = name.toLowerCase();
		return function (browser) {
			browser.app
				.click('@fieldListsMenu')
				.waitForElementVisible('@listScreen')
				.click('@' + nameLowercase + 'ListSubmenu')
				.waitForElementVisible('@listScreen');

			browser.listPage
				.click('@createFirstItemButton');

			browser.app
				.waitForElementVisible('@initialFormScreen');

			browser.initialFormPage.section.form.section[ nameLowercase + 'List' ].section.name
				.fillInput({value: name + ' Field Test 1'});

			browser.initialFormPage.section.form.section[ nameLowercase + 'List' ].section.name
				.verifyInput({value: name + ' Field Test 1'});

			browser.initialFormPage.section.form.section[ nameLowercase + 'List' ].section.fieldA
				.fillInput(testInputArray);

			browser.initialFormPage.section.form.section[ nameLowercase + 'List' ].section.fieldA
				.verifyInput(testInputArray);

			browser.initialFormPage.section.form
				.click('@createButton');

			browser.app
				.waitForElementVisible('@itemScreen');

			browser.itemPage
				.expect.element('@flashMessage')
				.text.to.equal('New ' + name + ' ' + name + ' Field Test 1 created.');

			browser.itemPage.section.form.section[ nameLowercase + 'List' ].section.name
				.verifyInput({value: name + ' Field Test 1'});

			browser.itemPage.section.form.section[ nameLowercase + 'List' ].section.fieldA
				.verifyInput(testInputArray);
		}
	},
	assertEditFormUX: function(name, testInputArray) {
		var nameLowercase = name.toLowerCase();
		return function (browser) {
			browser.itemPage.section.form.section[ nameLowercase + 'List' ].section.fieldB
				.fillInput(testInputArray);

			browser.itemPage.section.form
				.click('@saveButton');

			browser.app
				.waitForElementVisible('@itemScreen');

			browser.itemPage
				.expect.element('@flashMessage')
				.text.to.equal('Your changes have been saved.');

			browser.itemPage.section.form.section[ nameLowercase + 'List' ].section.name
				.verifyInput({value: name + ' Field Test 1'});

			browser.itemPage.section.form.section[ nameLowercase + 'List' ].section.fieldB
				.verifyInput(testInputArray);
		}
	},
	restore: function (browser) {
		browser.initialFormPage.section.form
			.click('@cancelButton');

		browser.app
			.waitForElementVisible('@listScreen');
	},
};
