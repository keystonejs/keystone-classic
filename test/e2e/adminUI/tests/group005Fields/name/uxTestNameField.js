var fieldTests = require('../commonFieldTestUtils.js');

module.exports = {
	before: fieldTests.before,
	after: fieldTests.after,
	'Name field can be filled via the initial modal': function(browser) {
		browser.app.openFieldList('Name');
		browser.listPage.createFirstItem();
		browser.app.waitForInitialFormScreen();
		browser.initialFormPage.fillInputs({
			listName: 'Name',
			fields: {
				'name': {value: 'Name Field Test 1'},
				'fieldA': {firstName: 'First 1', lastName: 'Last 1'},
			}
		});
		browser.initialFormPage.assertInputs({
			listName: 'Name',
			fields: {
				'name': {value: 'Name Field Test 1'},
				'fieldA': {firstName: 'First 1', lastName: 'Last 1'},
			}
		});
		browser.initialFormPage.save();
		browser.app.waitForItemScreen();
		browser.itemPage.assertFlashMessage('New Name Name Field Test 1 created.');
		browser.itemPage.assertInputs({
			listName: 'Name',
			fields: {
				'name': {value: 'Name Field Test 1'},
				'fieldA': {firstName: 'First 1', lastName: 'Last 1'},
			}
		})
	},
	'Name field can be filled via the edit form': function(browser) {
		browser.itemPage.fillInputs({
			listName: 'Name',
			fields: {
				'fieldB': {firstName: 'First 2', lastName: 'Last 2'}
			}
		});
		browser.itemPage.save();
		browser.itemPage.assertFlashMessage('Your changes have been saved.');
		browser.itemPage.assertInputs({
			listName: 'Name',
			fields: {
				'name': {value: 'Name Field Test 1'},
				'fieldA': {firstName: 'First 1', lastName: 'Last 1'},
				'fieldB': {firstName: 'First 2', lastName: 'Last 2'}
			}
		})
	},
};
