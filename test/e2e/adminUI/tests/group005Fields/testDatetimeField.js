var fieldTests = require('./commonFieldTestUtils.js');

module.exports = {
	'@disabled': true, // TODO:  https://github.com/keystonejs/keystone/issues/3330
	before: fieldTests.before,
	after: fieldTests.after,
	'Datetime field should show correctly in the initial modal': function (browser) {
		browser.app.openFieldList('Datetime');
		browser.listScreen.createFirstItem();
		browser.app.waitForInitialFormScreen();

		browser.initialFormScreen.assertUI({
			listName: 'Datetime',
			fields: ['name', 'fieldA']
		});
	},
	'restoring test state': function(browser) {
		browser.initialFormScreen.cancel();
		browser.app.waitForListScreen();
	},
	'Datetime field can be filled via the initial modal': function(browser) {
		browser.app.openFieldList('Datetime');
		browser.listScreen.createFirstItem();
		browser.app.waitForInitialFormScreen();
		browser.initialFormScreen.fillInputs({
			listName: 'Datetime',
			fields: {
				'name': {value: 'Datetime Field Test 1'},
				'fieldA': {date: '2016-01-01', time: '12:00:00 am'},
			}
		});
		/* TODO Pending fix of timezone issues which are causing Travis CI to fail
		browser.initialFormScreen.assertInputs({
			listName: 'Datetime',
			fields: {
				'name': {value: 'Datetime Field Test 1'},
				'fieldA': {date: '2016-01-01', time: '12:00:00 am'},
			}
		});
		*/
		browser.initialFormScreen.save();
		browser.app.waitForItemScreen();
		/* TODO Pending fix of timezone issues which are causing Travis CI to fail
		browser.itemScreen.assertInputs({
			listName: 'Datetime',
			fields: {
				'name': {value: 'Datetime Field Test 1'},
				'fieldA': {date: '2016-01-01', time: '12:00:00 am'},
			}
		})
		*/
	},
	'Datetime field should show correctly in the edit form': function(browser) {
		browser.itemScreen.assertUI({
			listName: 'Datetime',
			fields: ['fieldA', 'fieldB']
		});
	},
	'Datetime field can be filled via the edit form': function(browser) {
		browser.itemScreen.fillInputs({
			listName: 'Datetime',
			fields: {
				'fieldB': {date: '2016-01-02', time: '12:00:00 am'}
			}
		});
		browser.itemScreen.save();
		browser.app.waitForItemScreen();
		browser.itemScreen.assertFlashMessage('Your changes have been saved successfully');
		/* TODO Pending fix of timezone issues which are causing Travis CI to fail
		browser.itemScreen.assertInputs({
			listName: 'Datetime',
			fields: {
				'name': {value: 'Datetime Field Test 1'},
				'fieldA': {date: '2016-01-01', time: '12:00:00 am'},
				'fieldB': {date: '2016-01-02', time: '12:00:00 am'}
			}
		})
		*/
	},
};
