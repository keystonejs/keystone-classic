var fieldTests = require('./commonFieldTestUtils.js');

module.exports = {
	before: fieldTests.before,
	after: fieldTests.after,
	'NumberArray field should show correctly in the initial modal': function (browser) {
		browser.app.openFieldList('NumberArray');
		browser.listScreen.createFirstItem();
		browser.app.waitForInitialFormScreen();

		browser.initialFormScreen.assertUI({
			listName: 'NumberArray',
			fields: ['name']
		});
	},
	'restoring test state': function(browser) {
		browser.initialFormScreen.cancel();
		browser.app.waitForListScreen();
	},
	'NumberArray field can be filled via the initial modal': function(browser) {
		browser.app.openFieldList('NumberArray');
		browser.listScreen.createFirstItem();
		browser.app.waitForInitialFormScreen();
		browser.initialFormScreen.fillInputs({
			listName: 'NumberArray',
			fields: {
				'name': {value: 'NumberArray Field Test 1'},
			}
		});
		 browser.initialFormScreen.assertInputs({
			 listName: 'NumberArray',
			 fields: {
			 	'name': {value: 'NumberArray Field Test 1'},
			 }
		 });
		browser.initialFormScreen.save();
		browser.app.waitForItemScreen();
		 browser.itemScreen.assertInputs({
			 listName: 'NumberArray',
			 fields: {
			 	'name': {value: 'NumberArray Field Test 1'},
			 }
		 })
	},
	'NumberArray field should show correctly in the edit form': function(browser) {
		browser.itemScreen.assertUI({
			listName: 'NumberArray',
			fields: ['fieldA', 'fieldB']
		});
		browser.itemScreen.section.form.section.numberarrayList.section.fieldA.addNumber();
		browser.itemScreen.assertUI({
			listName: 'NumberArray',
			fields: ['fieldA'],
			args: {'numberInputs': ['number1']}
		});
		browser.itemScreen.section.form.section.numberarrayList.section.fieldA.addNumber();
		browser.itemScreen.assertUI({
			listName: 'NumberArray',
			fields: ['fieldA'],
			args: {'numberInputs': ['number1', 'number2']}
		});
		browser.itemScreen.section.form.section.numberarrayList.section.fieldB.addNumber();
		browser.itemScreen.section.form.section.numberarrayList.section.fieldB.addNumber();
		browser.itemScreen.assertUI({
			listName: 'NumberArray',
			fields: ['fieldB'],
			args: {'numberInputs': ['number1', 'number2']}
		});
	},
	'NumberArray field can be filled via the edit form': function(browser) {
		browser.itemScreen.fillInputs({
			listName: 'NumberArray',
			fields: {
				'fieldA': {number1: '1', number2: '2'}
			}
		});
		browser.itemScreen.fillInputs({
			listName: 'NumberArray',
			fields: {
				'fieldB': {number1: '3', number2: '4'}
			}
		});
		browser.itemScreen.save();
		browser.app.waitForItemScreen();
		browser.itemScreen.assertFlashMessage('Your changes have been saved successfully');
		browser.itemScreen.assertInputs({
			listName: 'NumberArray',
		 	fields: {
		 		'name': {value: 'NumberArray Field Test 1'},
		 		'fieldA': {number1: '1', number2: '2'},
		 		'fieldB': {number1: '3', number2: '4'},
		 	}
		 })
	},
};
