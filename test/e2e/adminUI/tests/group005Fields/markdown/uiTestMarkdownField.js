var fieldTests = require('../commonFieldTestUtils.js');

module.exports = {
	before: fieldTests.before,
	after: fieldTests.after,
	'Markdown field should show correctly in the initial modal': function (browser) {
		browser.app.openFieldList('Markdown');
		browser.listPage.createFirstItem();
		browser.app.waitForInitialFormScreen();

		browser.initialFormPage.assertUI({
			listName: 'Markdown',
			fields: ['name', 'fieldA']
		});
	},
	'restoring test state': function(browser) {
		browser.initialFormPage.cancel();
		browser.app.waitForListScreen();
	},
};
