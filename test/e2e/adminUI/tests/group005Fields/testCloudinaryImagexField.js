var fieldTests = require('./commonFieldTestUtils.js');

module.exports = {
	before: fieldTests.before,
	after: fieldTests.after,
	'CloudinaryImagex field should show correctly in the initial modal': function (browser) {
		browser.app.openFieldList('CloudinaryImagex');
		browser.listPage.createFirstItem();
		browser.app.waitForInitialFormScreen();

		browser.initialFormPage.assertUI({
			listName: 'CloudinaryImagex',
			fields: ['name']
		});
	},
	'restoring test state': function(browser) {
		browser.initialFormPage.cancel();
		browser.app.waitForListScreen();
	},
	'CloudinaryImagex field can be filled via the initial modal': function(browser) {
		browser.app.openFieldList('CloudinaryImagex');
		browser.listPage.createFirstItem();
		browser.app.waitForInitialFormScreen();
		browser.initialFormPage.fillInputs({
			listName: 'CloudinaryImagex',
			fields: {
				'name': {value: 'CloudinaryImagex Field Test 1'},
			}
		});
		browser.initialFormPage.assertInputs({
			listName: 'CloudinaryImagex',
			fields: {
				'name': {value: 'CloudinaryImagex Field Test 1'},
			}
		});
		browser.initialFormPage.save();
		browser.app.waitForItemScreen();

		browser.itemPage.assertInputs({
			listName: 'CloudinaryImagex',
			fields: {
				'name': {value: 'CloudinaryImagex Field Test 1'},
			}
		})
	},
	'CloudinaryImagex field should show correctly in the edit form': function(browser) {
		browser.itemPage.assertUI({
			listName: 'CloudinaryImagex',
			fields: ['fieldA', 'fieldB']
		});
	},
};
