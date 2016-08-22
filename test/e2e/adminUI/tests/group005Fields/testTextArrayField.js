var fieldTests = require('./commonFieldTestUtils.js');

module.exports = {
	before: fieldTests.before,
	after: fieldTests.after,
	'TextArray field should show correctly in the initial modal': function (browser) {
		browser.app.openFieldList('TextArray');
		browser.listScreen.createFirstItem();
		browser.app.waitForInitialFormScreen();

		browser.initialFormScreen.assertUI({
			listName: 'TextArray',
			fields: ['name']
		});
	},
	'restoring test state': function(browser) {
		browser.initialFormScreen.cancel();
		browser.app.waitForListScreen();
	},
	'TextArray field can be filled via the initial modal': function(browser) {
		browser.app.openFieldList('TextArray');
		browser.listScreen.createFirstItem();
		browser.app.waitForInitialFormScreen();
		browser.initialFormScreen.fillInputs({
			listName: 'TextArray',
			fields: {
				'name': {value: 'TextArray Field Test 1'},
			}
		});
		browser.initialFormScreen.assertInputs({
			listName: 'TextArray',
			fields: {
				'name': {value: 'TextArray Field Test 1'},
			}
		});
		browser.initialFormScreen.save();
		browser.app.waitForItemScreen();
		browser.itemScreen.assertInputs({
			listName: 'TextArray',
			fields: {
				'name': {value: 'TextArray Field Test 1'},
			}
		})
	},
	'TextArray field should show correctly in the edit form': function(browser) {
		browser.itemScreen.assertUI({
			listName: 'TextArray',
			fields: ['fieldA', 'fieldB']
		});
		browser.itemScreen.section.form.section.textarrayList.section.fieldA.addText();
		browser.itemScreen.assertUI({
			listName: 'TextArray',
			fields: ['fieldA'],
			args: {'textInputs': ['text1']}
		});
		browser.itemScreen.section.form.section.textarrayList.section.fieldA.addText();
		browser.itemScreen.assertUI({
			listName: 'TextArray',
			fields: ['fieldA'],
			args: {'textInputs': ['text1', 'text2']}
		});
		browser.itemScreen.section.form.section.textarrayList.section.fieldB.addText();
		browser.itemScreen.section.form.section.textarrayList.section.fieldB.addText();
		browser.itemScreen.assertUI({
			listName: 'TextArray',
			fields: ['fieldB'],
			args: {'textInputs': ['text1', 'text2']}
		});
	},
	'TextArray field can be filled via the edit form': function(browser) {
		browser.itemScreen.fillInputs({
			listName: 'TextArray',
			fields: {
				'fieldA': {text1: 'Test text 1', text2: 'Test text 2'}
			}
		});
		browser.itemScreen.fillInputs({
			listName: 'TextArray',
			fields: {
				'fieldB': {text1: 'Test text 3', text2: 'Test text 4'}
			}
		});
		browser.itemScreen.save();
		browser.app.waitForItemScreen();
		browser.itemScreen.assertFlashMessage('Your changes have been saved successfully');
		browser.itemScreen.assertInputs({
			listName: 'TextArray',
			fields: {
				'name': {value: 'TextArray Field Test 1'},
				'fieldA': {text1: 'Test text 1', text2: 'Test text 2'},
				'fieldB': {text1: 'Test text 3', text2: 'Test text 4'},
			}
		})
	},
};
