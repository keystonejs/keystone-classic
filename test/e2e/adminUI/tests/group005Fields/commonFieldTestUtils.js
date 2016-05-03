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
	openInitialForm: function(config) {
		var list = config.listName.toLowerCase() + 'List';
		var listSubmenu = '@' + list + 'Submenu';
		return function (browser){
			browser.app
				.click('@fieldListsMenu')
				.waitForElementVisible('@listScreen')
				.click(listSubmenu)
				.waitForElementVisible('@listScreen');

			browser.listPage
				.click('@createFirstItemButton');

			browser.app
				.waitForElementVisible('@initialFormScreen');
		}
	},
	fillInitialForm: function(config) {
		var list = config.listName.toLowerCase() + 'List';
		return function (browser) {
			fields = Object.keys(config.fields);
			fields.forEach(function(field) {
				browser.initialFormPage.section.form.section[list].section[field]
					.fillInput(config.fields[field]);
			});
		}
	},
	assertInitialFormUX: function(config) {
		var list = config.listName.toLowerCase() + 'List';
		return function (browser) {
			fields = Object.keys(config.fields);
			fields.forEach(function(field) {
				browser.initialFormPage.section.form.section[list].section[field]
					.verifyInput(config.fields[field]);
			});
		}
	},
	saveInitialForm: function() {
		return function(browser) {
			browser.initialFormPage.section.form
				.click('@createButton');
		}
	},
	fillEditForm: function(config) {
		var list = config.listName.toLowerCase() + 'List';
		var listSubmenu = '@' + list + 'Submenu';
		return function (browser) {

			fields = Object.keys(config.fields);

			fields.forEach(function(field) {
				browser.itemPage.section.form.section[list].section[field]
					.fillInput(config.fields[field]);
			});
		}
	},
	saveEditForm: function(config) {
		return function(browser) {
		browser.itemPage.section.form
			.click('@saveButton');
		}
	},
	assertEditFormUX: function(config) {
		var list = config.listName.toLowerCase() + 'List';
		var listSubmenu = '@' + list + 'Submenu';
		return function (browser) {

			fields = Object.keys(config.fields);

			fields.forEach(function(field) {
				browser.itemPage.section.form.section[list].section[field]
					.verifyInput(config.fields[field]);
			});
		}
	},
	assertFlashMessageUX: function(config) {
		var message = config.message;
		return function(browser) {
			browser.app
				.waitForElementVisible('@itemScreen');

			browser.itemPage
				.expect.element('@flashMessage')
				.text.to.equal(message);
		}
	},
	restore: function (browser) {
		browser.initialFormPage.section.form
			.click('@cancelButton');

		browser.app
			.waitForElementVisible('@listScreen');
	},
};
