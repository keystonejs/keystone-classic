var fieldTests = require('./commonFieldTestUtils.js');

module.exports = {
	before: fieldTests.before,
	after: fieldTests.after,
	'Date field should show correctly in the initial modal': function (browser) {
		browser.app.openFieldList('Date');
		browser.listScreen.createFirstItem();
		browser.app.waitForInitialFormScreen();

		browser.initialFormScreen.assertUI({
			listName: 'Date',
			fields: ['name', 'fieldA']
		});
	},
	'restoring test state': function(browser) {
		browser.initialFormScreen.cancel();
		browser.app.waitForListScreen();
	},
	'Date field can be filled via the initial modal': function(browser) {
		browser.app.openFieldList('Date');
		browser.listScreen.createFirstItem();
		browser.app.waitForInitialFormScreen();
		browser.initialFormScreen.fillInputs({
			listName: 'Date',
			fields: {
				'name': {value: 'Date Field Test 1'},
				'fieldA': {value: '2016-01-01'},
			}
		});
		/* TODO Pending fix of timezone issues which are causing Travis CI to fail
		browser.initialFormScreen.assertInputs({
			listName: 'Date',
			fields: {
				'name': {value: 'Date Field Test 1'},
				'fieldA': {value: '2016-01-01'},
			}
		});
		*/
		browser.initialFormScreen.save();
		browser.app.waitForItemScreen();
		/* TODO Pending fix of timezone issues which are causing Travis CI to fail
		browser.itemScreen.assertInputs({
			listName: 'Date',
			fields: {
				'name': {value: 'Date Field Test 1'},
				'fieldA': {value: '2016-01-01'},
			}
		})
		*/
	},
	'Date field should show correctly in the edit form': function(browser) {
		browser.itemScreen.assertUI({
			listName: 'Date',
			fields: ['fieldA', 'fieldB']
		});
	},
	'Date field can be filled via the edit form': function(browser) {
		browser.itemScreen.fillInputs({
			listName: 'Date',
			fields: {
				'fieldB': {value: '2016-01-02'}
			}
		});
		// Drop focus on the date field so the popup disappears.
		browser.execute(function() {
			document.activeElement.blur();
		});
		browser.itemScreen.save();
		browser.app.waitForItemScreen();
		browser.itemScreen.assertFlashMessage('Your changes have been saved successfully');
		/* TODO Pending fix of timezone issues which are causing Travis CI to fail
		browser.itemScreen.assertInputs({
			listName: 'Date',
			fields: {
				'name': {value: 'Date Field Test 1'},
				'fieldA': {value: '2016-01-01'},
				'fieldB': {value: '2016-01-02'}
			}
		})
		*/
	},
};
