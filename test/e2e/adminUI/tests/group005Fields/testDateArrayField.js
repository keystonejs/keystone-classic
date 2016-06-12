var fieldTests = require('./commonFieldTestUtils.js');

module.exports = {
	before: fieldTests.before,
	after: fieldTests.after,
	'DateArray field should show correctly in the initial modal': function (browser) {
		browser.app.openFieldList('DateArray');
		browser.listPage.createFirstItem();
		browser.app.waitForInitialFormScreen();

		browser.initialFormPage.assertUI({
			listName: 'DateArray',
			fields: ['name']
		});
	},
	'restoring test state': function(browser) {
		browser.initialFormPage.cancel();
		browser.app.waitForListScreen();
	},
	'DateArray field can be filled via the initial modal': function(browser) {
		browser.app.openFieldList('DateArray');
		browser.listPage.createFirstItem();
		browser.app.waitForInitialFormScreen();
		browser.initialFormPage.fillInputs({
			listName: 'DateArray',
			fields: {
				'name': {value: 'DateArray Field Test 1'},
			}
		});
		/* TODO Pending fix of timezone issues which are causing Travis CI to fail
		browser.initialFormPage.assertInputs({
			listName: 'DateArray',
			fields: {
				'name': {value: 'DateArray Field Test 1'},
			}
		});
		*/
		browser.initialFormPage.save();
		browser.app.waitForItemScreen();
		/* TODO Pending fix of timezone issues which are causing Travis CI to fail
		browser.itemPage.assertInputs({
			listName: 'DateArray',
			fields: {
				'name': {value: 'DateArray Field Test 1'},
			}
		});
		*/
	},
	'DateArray field should show correctly in the edit form': function(browser) {
		browser.itemPage.assertUI({
			listName: 'DateArray',
			fields: ['fieldA', 'fieldB']
		});
		browser.itemPage.section.form.section.datearrayList.section.fieldA.addDate();
		browser.itemPage.assertUI({
			listName: 'DateArray',
			fields: ['fieldA'],
			args: {'dateInputs': ['date1']}
		});
		browser.itemPage.section.form.section.datearrayList.section.fieldA.addDate();
		browser.itemPage.assertUI({
			listName: 'DateArray',
			fields: ['fieldA'],
			args: {'dateInputs': ['date1', 'date2']}
		});
		browser.itemPage.section.form.section.datearrayList.section.fieldB.addDate();
		browser.itemPage.section.form.section.datearrayList.section.fieldB.addDate();
		browser.itemPage.assertUI({
			listName: 'DateArray',
			fields: ['fieldB'],
			args: {'dateInputs': ['date1', 'date2']}
		});
	},
	'DateArray field can be filled via the edit form': function(browser) {
		browser.itemPage.fillInputs({
			listName: 'DateArray',
			fields: {
				'fieldA': {date1: '2016-01-01', date2: '2016-01-02'}
			}
		});
		browser.itemPage.fillInputs({
			listName: 'DateArray',
			fields: {
				'fieldB': {date1: '2016-01-03', date2: '2016-01-04'}
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
			listName: 'DateArray',
			fields: {
				'name': {value: 'DateArray Field Test 1'},
				'fieldA': {date1: '2016-01-01', date2: '2016-01-02'},
				'fieldB': {date1: '2016-01-03', date2: '2016-01-04'},
			}
		});
		*/
	},
};
