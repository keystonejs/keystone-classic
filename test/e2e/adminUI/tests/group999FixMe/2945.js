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
	'Demonstrate issue 2945': function(browser) {
		// Create items
		browser.app.openFixMeList('NoDefaultColumn');
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

		// Issue demonstration #1. If no default is set, the ID should be used.
		browser.app.navigate('http://localhost:3000/keystone/no-default-columns');
		browser.listPage.expect.element('@firstColumnHeader').text.to.equal('ID');

		// Issue demonstration #2. If specific columns have been requested, they should be shown.
		browser.app.navigate('http://localhost:3000/keystone/no-default-columns?columns=id%2CfieldA');
		browser.listPage.expect.element('@firstColumnHeader').text.to.equal('ID');
		browser.listPage.expect.element('@secondColumnHeader').text.to.equal('Field A');

	}
};
