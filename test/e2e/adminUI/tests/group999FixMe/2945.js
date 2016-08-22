module.exports = {
	before: function (browser) {
		browser.app = browser.page.app();
		browser.signinScreen = browser.page.signin();
		browser.listScreen = browser.page.list();
		browser.itemScreen = browser.page.item();
		browser.initialFormScreen = browser.page.initialForm();

		browser.app.gotoHomeScreen();
		browser.app.waitForSigninScreen();

		browser.signinScreen.signin();
		browser.app.waitForHomeScreen();
	},
	after: function (browser) {
		browser.app.signout();
		browser.end();
	},
	'List screen must show ID column if it has neither default nor name columns': function(browser) {
		// Create items
		browser.app.openMiscList('NoDefaultColumn');
		browser.listScreen.createFirstItem();
		browser.app.waitForInitialFormScreen();
		browser.initialFormScreen.fillInputs({
			listName: 'NoDefaultColumn',
			fields: {
				'fieldA': {value: 'testing'},
			}
		});
		browser.initialFormScreen.save();
		browser.app.waitForItemScreen();

		// If no default is set, the ID should be used.
		browser.app.navigate('http://localhost:3000/keystone/no-default-columns');
		browser.listScreen.expect.element('@firstColumnHeader').text.to.equal('ID');
	},
	'List screen must show requested columns': function(browser) {
		// If specific columns have been requested, they should be shown.
		browser.app.navigate('http://localhost:3000/keystone/no-default-columns?columns=id%2CfieldA');
		browser.listScreen.expect.element('@firstColumnHeader').text.to.equal('ID');
		browser.listScreen.expect.element('@secondColumnHeader').text.to.equal('Field A');

	}
};
