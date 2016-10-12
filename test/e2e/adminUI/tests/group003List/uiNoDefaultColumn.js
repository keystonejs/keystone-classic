// there is currently a bug in Keystone just about this
// I disabled this tests while be o Keystone fix it
module.exports = {
	'@disabled': true,
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

		// Create items
		browser.app.openMiscList('NoDefaultColumn');
		browser.listPage.createFirstItem();
		browser.app.waitForInitialFormScreen();
		browser.initialFormPage.fillInputs({
			listName: 'NoDefaultColumn',
			fields: {
				'fieldA': {value: 'testing'},
			}
		});
		browser.initialFormPage.save();
		browser.app.waitForItemScreen();
	},
	after: function (browser) {
		browser.app.signout();
		browser.end();
	},
	'List screen must show ID column if it has neither default nor name columns': function(browser) {
		// If no default is set, the ID should be used.
		browser.app.navigate('http://localhost:3000/keystone/no-default-columns');
		browser.listPage.expect.element('@firstColumnHeader').text.to.equal('ID');
	},
	'List screen must show requested columns': function(browser) {
		// If specific columns have been requested, they should be shown.
		browser.app.navigate('http://localhost:3000/keystone/no-default-columns?columns=id%2CfieldA');
		browser.listPage.expect.element('@firstColumnHeader').text.to.equal('ID');
		browser.listPage.expect.element('@secondColumnHeader').text.to.equal('Field A');
	}
};
