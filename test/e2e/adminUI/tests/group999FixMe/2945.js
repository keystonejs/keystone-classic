module.exports = {
	before: function (browser) {
		browser.adminUIApp = browser.page.adminUIApp();
		browser.signinScreen = browser.page.signinScreen();
		browser.listScreen = browser.page.listScreen();
		browser.itemScreen = browser.page.itemScreen();
		browser.initialFormScreen = browser.page.initialForm();

		browser.adminUIApp.gotoHomeScreen();
		browser.adminUIApp.waitForSigninScreen();

		browser.signinScreen.signin();
		browser.adminUIApp.waitForHomeScreen();
	},
	after: function (browser) {
		browser.adminUIApp.signout();
		browser.end();
	},
	'List screen must show ID column if it has neither default nor name columns': function(browser) {
		// Create items
		browser.adminUIApp.openMiscList('NoDefaultColumn');
		browser.listScreen.createFirstItem();
		browser.adminUIApp.waitForInitialFormScreen();
		browser.initialFormScreen.fillInputs({
			listName: 'NoDefaultColumn',
			fields: {
				'fieldA': {value: 'testing'},
			}
		});
		browser.initialFormScreen.save();
		browser.adminUIApp.waitForItemScreen();

		// If no default is set, the ID should be used.
		browser.adminUIApp.navigate('http://localhost:3000/keystone/no-default-columns');
		browser.listScreen.expect.element('@firstColumnHeader').text.to.equal('ID');
	},
	'List screen must show requested columns': function(browser) {
		// If specific columns have been requested, they should be shown.
		browser.adminUIApp.navigate('http://localhost:3000/keystone/no-default-columns?columns=id%2CfieldA');
		browser.listScreen.expect.element('@firstColumnHeader').text.to.equal('ID');
		browser.listScreen.expect.element('@secondColumnHeader').text.to.equal('Field A');

	}
};
