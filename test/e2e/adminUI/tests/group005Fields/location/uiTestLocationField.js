var fieldTests = require('../commonFieldTestUtils.js');

module.exports = {
	before: fieldTests.before,
	after: fieldTests.after,
	'Location field should show correctly in the initial modal': function (browser) {
		browser.app.openFieldList('Location');
		browser.listPage.createFirstItem();
		browser.app.waitForInitialFormScreen();

		browser.initialFormPage.assertUI({
			listName: 'Location',
			fields: ['name', 'fieldA'],
			args: { 'showMore': false },
		});

		browser.initialFormPage.section.form.section.locationList.section.fieldA.showMore();

		browser.initialFormPage.assertUI({
			listName: 'Location',
			fields: ['name', 'fieldA'],
			args: { 'showMore': true },
		});
	},
	'restoring test state': function(browser) {
		browser.initialFormPage.cancel();
		browser.app.waitForListScreen();
	},
};
