var fieldTests = require('../commonFieldTestUtils.js');

module.exports = {
	before: fieldTests.before,
	after: fieldTests.after,
	'Key field can be filled via the initial modal': function(browser) {
		browser.app.openFieldList('Key');
		browser.listPage.createFirstItem();
		browser.app.waitForInitialFormScreen();
		browser.initialFormPage.fillInputs({
			listName: 'Key',
			fields: {
				'name': {value: 'Key Field Test 1'},
				'fieldA': {value: 'A test key for field A'},
			}
		});
		browser.initialFormPage.assertInputs({
			listName: 'Key',
			fields: {
				'name': {value: 'Key Field Test 1'},
				'fieldA': {value: 'A test key for field A'},
			}
		});
		browser.initialFormPage.save();
		browser.app.waitForItemScreen();

		browser.itemPage.assertInputs({
			listName: 'Key',
			fields: {
				'name': {value: 'Key Field Test 1'},
				'fieldA': {value: 'a-test-key-for-field-a'},
			}
		})
	},
	'Key field can be filled via the edit form': function(browser) {
		browser.itemPage.fillInputs({
			listName: 'Key',
			fields: {
				'fieldB': {value: 'A test key for field B'}
			}
		});
		browser.itemPage.save();
		browser.app.waitForItemScreen();
		browser.itemPage.assertFlashMessage('Your changes have been saved successfully');
		browser.itemPage.assertInputs({
			listName: 'Key',
			fields: {
				'name': {value: 'Key Field Test 1'},
				'fieldA': {value: 'a-test-key-for-field-a'},
				'fieldB': {value: 'a-test-key-for-field-b'}
			}
		})
	},
};
