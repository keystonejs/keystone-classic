var fieldTests = require('./commonFieldTestUtils.js');

module.exports = {
	before: fieldTests.before,
	after: fieldTests.after,
	'Date field should show correctly in the initial modal': function (browser) {
		browser.app.openFieldList('Date');
		browser.listPage.createFirstItem();
		browser.app.waitForInitialFormScreen();

		browser.initialFormPage.assertUI({
			listName: 'Date',
			fields: ['name', 'fieldA']
		});
	},
	'restoring test state': function(browser) {
		browser.initialFormPage.cancel();
		browser.app.waitForListScreen();
	},
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
		/* TODO Pending fix of timezone issues which are causing Travis CI to fail
		browser.initialFormPage.assertInputs({
			listName: 'Date',
			fields: {
				'name': {value: 'Date Field Test 1'},
				'fieldA': {value: '2016-01-01'},
			}
		});
		*/
		browser.initialFormPage.save();
		browser.app.waitForItemScreen();
		/* TODO Pending fix of timezone issues which are causing Travis CI to fail
		browser.itemPage.assertInputs({
			listName: 'Date',
			fields: {
				'name': {value: 'Date Field Test 1'},
				'fieldA': {value: '2016-01-01'},
			}
		})
		*/
	},
	'Date field should show correctly in the edit form': function(browser) {
		browser.itemPage.assertUI({
			listName: 'Date',
			fields: ['fieldA', 'fieldB']
		});
	},
	'Date field can be filled via the edit form': function(browser) {
		browser.itemPage.fillInputs({
			listName: 'Date',
			fields: {
				'fieldB': {value: '2016-01-02'}
			}
		});
		// Drop focus on the date field so the popup disappears.
		browser.execute(function() {
			document.activeElement.blur();
		});
		browser.itemPage.save();
		browser.app.waitForItemScreen();
		browser.itemPage.assertFlashMessage('Your changes have been saved successfully');
		/* TODO Pending fix of timezone issues which are causing Travis CI to fail
		browser.itemPage.assertInputs({
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
