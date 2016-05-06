var fieldTests = require('../commonFieldTestUtils');

module.exports = {
	before: fieldTests.before,
	after: fieldTests.after,
	'Boolean field should show correctly in the initial model': function (browser) {
		browser.app.openFieldList('Boolean');
		browser.listPage.createFirstItem();
		browser.app.waitForInitialFormScreen();

		browser.initialFormPage.assertUI({
			listName: 'Boolean',
			fields: ['name', 'fieldA']
		});
	},
	'restoring test state': function (browser) {
		browser.initialFormPage.cancel();
		browser.app.waitForListScreen();
	}
};
