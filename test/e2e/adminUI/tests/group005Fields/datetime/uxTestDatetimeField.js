var fieldTests = require('../commonFieldTestUtils.js');

module.exports = {
	before: fieldTests.before,
	after: fieldTests.after,
	'Datetime field can be filled via the initial modal': function(browser) {
		browser.app.openFieldList('Datetime');
		browser.listPage.createFirstItem();
		browser.app.waitForInitialFormScreen();
		browser.initialFormPage.fillInputs({
			listName: 'Datetime',
			fields: {
				'name': {value: 'Datetime Field Test 1'},
				'fieldA': {date: '2016-01-01', time: '12:00:00 am'},
			}
		});
		browser.initialFormPage.assertInputs({
			listName: 'Datetime',
			fields: {
				'name': {value: 'Datetime Field Test 1'},
				'fieldA': {date: '2016-01-01', time: '12:00:00 am'},
			}
		});
		browser.initialFormPage.save();
		browser.app.waitForItemScreen();
		browser.itemPage.assertFlashMessage('New Datetime Datetime Field Test 1 created.');
		browser.itemPage.assertInputs({
			listName: 'Datetime',
			fields: {
				'name': {value: 'Datetime Field Test 1'},
				'fieldA': {date: '2016-01-01', time: '12:00:00 am'},
			}
		})
	},
	/* TODO Pending a fix for issue #2715
	'Datetime field can be filled via the edit form': function(browser) {
		browser.itemPage.fillInputs({
			listName: 'Datetime',
			fields: {
				'fieldB': {date: '2016-01-02', time: '12:00:00 am'}
			}
		});
		browser.itemPage.save();
		browser.itemPage.assertFlashMessage('Your changes have been saved.');
		browser.itemPage.assertInputs({
			listName: 'Datetime',
			fields: {
				'name': {value: 'Datetime Field Test 1'},
				'fieldA': {date: '2016-01-01', time: '12:00:00 am'},
				'fieldB': {date: '2016-01-02', time: '12:00:00 am'}
			}
		})
	},
	*/
};
