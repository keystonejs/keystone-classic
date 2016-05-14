var fieldTests = require('./commonFieldTestUtils.js');

module.exports = {
	before: fieldTests.before,
	after: fieldTests.after,
	'Code field should show correctly in the initial modal': function (browser) {
		browser.app.openFieldList('Code');
		browser.listPage.createFirstItem();
		browser.app.waitForInitialFormScreen();

		browser.initialFormPage.assertUI({
			listName: 'Code',
			fields: ['name', 'fieldA']
		});
	},
	'restoring test state': function(browser) {
		browser.initialFormPage.cancel();
		browser.app.waitForListScreen();
	},
	'Code field can be filled via the initial modal': function(browser) {
		browser.app.openFieldList('Code');
		browser.listPage.createFirstItem();
		browser.app.waitForInitialFormScreen();
		browser.initialFormPage.fillInputs({
			listName: 'Code',
			fields: {
				'name': {value: 'Code Field Test 1'},
				'fieldA': {value: 'Some test code for field A'},
			}
		});
		browser.initialFormPage.assertInputs({
			listName: 'Code',
			fields: {
				'name': {value: 'Code Field Test 1'},
				'fieldA': {value: 'Some test code for field A'},
			}
		});
		browser.initialFormPage.save();
		browser.app.waitForItemScreen();

		browser.itemPage.assertInputs({
			listName: 'Code',
			fields: {
				'name': {value: 'Code Field Test 1'},
				'fieldA': {value: 'Some test code for field A'},
			}
		})
	},
	'Code field should show correctly in the edit form': function(browser) {
		browser.itemPage.assertUI({
			listName: 'Code',
			fields: ['fieldA', 'fieldB']
		});
	},
	'Code field can be filled via the edit form': function(browser) {
		browser.itemPage.fillInputs({
			listName: 'Code',
			fields: {
				'fieldB': {value: 'Some test code for field B'}
			}
		});
		browser.itemPage.save();
		browser.app.waitForItemScreen();
		browser.itemPage.assertFlashMessage('Your changes have been saved successfully');
		browser.itemPage.assertInputs({
			listName: 'Code',
			fields: {
				'name': {value: 'Code Field Test 1'},
				'fieldA': {value: 'Some test code for field A'},
				'fieldB': {value: 'Some test code for field B'}
			}
		})
	},
	'restoring test state': function(browser) {
		browser.initialFormPage.cancel();
		browser.app.waitForListScreen();
	},
};
