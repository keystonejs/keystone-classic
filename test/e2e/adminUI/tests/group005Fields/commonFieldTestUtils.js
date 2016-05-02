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
	assertInitialFormUI: function (config) {
		var list = config.listName.toLowerCase() + 'List';
		var listSubmenu = '@' + list + 'Submenu';
		return function (browser) {
			browser.app
				.click('@fieldListsMenu')
				.waitForElementVisible('@listScreen')
				.click(listSubmenu)
				.waitForElementVisible('@listScreen');

			browser.listPage
				.click('@createFirstItemButton');

			browser.app
				.waitForElementVisible('@initialFormScreen');

			config.fields.forEach(function(field) {
				browser.initialFormPage.section.form.section[list].section[field]
					.verifyUI();
			});
		}
	},
	assertInitialFormUX: function(config){
		var list = config.listName.toLowerCase() + 'List';
		var listSubmenu = '@' + list + 'Submenu';
		return function (browser) {
			browser.app
				.click('@fieldListsMenu')
				.waitForElementVisible('@listScreen')
				.click(listSubmenu)
				.waitForElementVisible('@listScreen');

			browser.listPage
				.click('@createFirstItemButton');

			browser.app
				.waitForElementVisible('@initialFormScreen');

			fields = Object.keys(config.inputs);
			fields.forEach(function(field) {
				browser.initialFormPage.section.form.section[list].section[field]
					.fillInput(config.inputs[field]);

				browser.initialFormPage.section.form.section[list].section[field]
					.verifyInput(config.inputs[field]);
			});

			browser.initialFormPage.section.form
				.click('@createButton');

			browser.app
				.waitForElementVisible('@itemScreen');

			browser.itemPage
				.expect.element('@flashMessage')
				.text.to.equal('New ' + config.listName + ' ' + config.inputs.name.value + ' created.');

			fields.forEach(function(field) {
				browser.itemPage.section.form.section[list].section[field]
					.verifyInput(config.inputs[field]);
			});
		}
	},
	assertEditFormUX: function(config) {
		var list = config.listName.toLowerCase() + 'List';
		var listSubmenu = '@' + list + 'Submenu';
		return function (browser) {

			fields = Object.keys(config.inputs);

			fields.forEach(function(field) {
				browser.itemPage.section.form.section[list].section[field]
					.fillInput(config.inputs[field]);
			});

			browser.itemPage.section.form
				.click('@saveButton');

			browser.app
				.waitForElementVisible('@itemScreen');

			browser.itemPage
				.expect.element('@flashMessage')
				.text.to.equal('Your changes have been saved.');

			fields.forEach(function(field) {
				browser.itemPage.section.form.section[list].section[field]
					.verifyInput(config.inputs[field]);
			});
		}
	},
	restore: function (browser) {
		browser.initialFormPage.section.form
			.click('@cancelButton');

		browser.app
			.waitForElementVisible('@listScreen');
	},
};
