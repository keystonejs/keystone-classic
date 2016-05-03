var fieldTests = require('../commonFieldTestUtils.js');

module.exports = {
	before: fieldTests.before,
	after: fieldTests.after,
	'Date field can be filled via the initial modal': function(browser) {
		browser.app.openFieldList('Date');
		browser.listPage.createFirstItem();
		browser.app.waitForInitialFormScreen();
		browser.initialFormPage.fillInputs({
			listName: 'Date',
			fields: {
				'name': {value: 'Date Field Test 1'},
				'fieldA': {value: '2016-01-01'},
			}
		});
		browser.initialFormPage.assertInputs({
			listName: 'Date',
			fields: {
				'name': {value: 'Date Field Test 1'},
				'fieldA': {value: '2016-01-01'},
			}
		});
		browser.initialFormPage.save();
		browser.app.waitForItemScreen();
		browser.itemPage.assertFlashMessage('New Date Date Field Test 1 created.');
		browser.itemPage.assertInputs({
			listName: 'Date',
			fields: {
				'name': {value: 'Date Field Test 1'},
				'fieldA': {value: '2016-01-01'},
			}
		})
	},
	'Date field can be filled via the edit form': function(browser) {
		browser.itemPage.fillInputs({
			listName: 'Date',
			fields: {
				'fieldB': {value: '2016-01-02'}
			}
		});
		browser.itemPage.save();
		browser.itemPage.assertFlashMessage('Your changes have been saved.');
		browser.itemPage.assertInputs({
			listName: 'Date',
			fields: {
				'name': {value: 'Date Field Test 1'},
				'fieldA': {value: '2016-01-01'},
				'fieldB': {value: '2016-01-02'}
			}
		})
	},
};
