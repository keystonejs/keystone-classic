var fieldTests = require('./commonFieldTestUtils.js');

module.exports = {
	before: fieldTests.before,
	after: fieldTests.after,
	'NumberArray field should show correctly in the initial modal': function (browser) {
		browser.app.openFieldList('NumberArray');
		browser.listPage.createFirstItem();
		browser.app.waitForInitialFormScreen();

		browser.initialFormPage.assertUI({
			listName: 'NumberArray',
			fields: ['name']
		});
	},
	'restoring test state': function(browser) {
		browser.initialFormPage.cancel();
		browser.app.waitForListScreen();
	},
	'NumberArray field can be filled via the initial modal': function(browser) {
		browser.app.openFieldList('NumberArray');
		browser.listPage.createFirstItem();
		browser.app.waitForInitialFormScreen();
		browser.initialFormPage.fillInputs({
			listName: 'NumberArray',
			fields: {
				'name': {value: 'NumberArray Field Test 1'},
			}
		});
		 browser.initialFormPage.assertInputs({
			 listName: 'NumberArray',
			 fields: {
			 	'name': {value: 'NumberArray Field Test 1'},
			 }
		 });
		browser.initialFormPage.save();
		browser.app.waitForItemScreen();
		 browser.itemPage.assertInputs({
			 listName: 'NumberArray',
			 fields: {
			 	'name': {value: 'NumberArray Field Test 1'},
			 }
		 })
	},
	'NumberArray field should show correctly in the edit form': function(browser) {
		browser.itemPage.assertUI({
			listName: 'NumberArray',
			fields: ['fieldA', 'fieldB']
		});
		browser.itemPage.section.form.section.numberarrayList.section.fieldA.addNumber();
		browser.itemPage.assertUI({
			listName: 'NumberArray',
			fields: ['fieldA'],
			args: {'numberInputs': ['number1']}
		});
		browser.itemPage.section.form.section.numberarrayList.section.fieldA.addNumber();
		browser.itemPage.assertUI({
			listName: 'NumberArray',
			fields: ['fieldA'],
			args: {'numberInputs': ['number1', 'number2']}
		});
		browser.itemPage.section.form.section.numberarrayList.section.fieldB.addNumber();
		browser.itemPage.section.form.section.numberarrayList.section.fieldB.addNumber();
		browser.itemPage.assertUI({
			listName: 'NumberArray',
			fields: ['fieldB'],
			args: {'numberInputs': ['number1', 'number2']}
		});
	},
	'NumberArray field can be filled via the edit form': function(browser) {
		browser.itemPage.fillInputs({
			listName: 'NumberArray',
			fields: {
				'fieldA': {number1: '1', number2: '2'}
			}
		});
		browser.itemPage.fillInputs({
			listName: 'NumberArray',
			fields: {
				'fieldB': {number1: '3', number2: '4'}
			}
		});
		browser.itemPage.save();
		browser.app.waitForItemScreen();
		browser.itemPage.assertFlashMessage('Your changes have been saved successfully');
		browser.itemPage.assertInputs({
			listName: 'NumberArray',
		 	fields: {
		 		'name': {value: 'NumberArray Field Test 1'},
		 		'fieldA': {number1: '1', number2: '2'},
		 		'fieldB': {number1: '3', number2: '4'},
		 	}
		 })
	},
};
