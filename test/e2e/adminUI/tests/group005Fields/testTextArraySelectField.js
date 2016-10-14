var fieldTests = require('./commonFieldTestUtils.js');

module.exports = {
	before: fieldTests.before,
	after: fieldTests.after,
	'TextArraySelect field should show correctly in the initial modal': function (browser) {
		browser.app.openFieldList('TextArraySelect');
		browser.listPage.createFirstItem();
		browser.app.waitForInitialFormScreen();

		browser.initialFormPage.assertUI({
			listName: 'TextArray',
			fields: ['name']
		});
	},
	'restoring test state': function(browser) {
		browser.initialFormPage.cancel();
		browser.app.waitForListScreen();
	},
	'TextArray field with an array of options transfor the inputs in selects': function(browser) {
		browser.app.openFieldList('TextArraySelect');
		browser.listPage.createFirstItem();
		browser.app.waitForInitialFormScreen();
		browser.initialFormPage.fillInputs({
			listName: 'TextArray',
			fields: {
				'name': {value: 'TextArray Field Test 1'},
			}
		});
		browser.initialFormPage.save();
		browser.app.waitForItemScreen();
		browser.listPage.addNewItem();
		browser.waitForElementPresent('.FormSelect[name="fieldA"]');
	}
};
