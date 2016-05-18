var fieldTests = require('./commonFieldTestUtils.js');

module.exports = {
	before: fieldTests.before,
	after: fieldTests.after,
	'TextArray field should show correctly in the initial modal': function (browser) {
		browser.app.openFieldList('TextArray');
		browser.listPage.createFirstItem();
		browser.app.waitForInitialFormScreen();

		browser.initialFormPage.assertUI({
			listName: 'TextArray',
			fields: ['name']
		});
	},
	'restoring test state': function(browser) {
		browser.initialFormPage.cancel();
		browser.app.waitForListScreen();
	},
	'TextArray field can be filled via the initial modal': function(browser) {
		browser.app.openFieldList('TextArray');
		browser.listPage.createFirstItem();
		browser.app.waitForInitialFormScreen();
		browser.initialFormPage.fillInputs({
			listName: 'TextArray',
			fields: {
				'name': {value: 'TextArray Field Test 1'},
			}
		});
		browser.initialFormPage.assertInputs({
			listName: 'TextArray',
			fields: {
				'name': {value: 'TextArray Field Test 1'},
			}
		});
		browser.initialFormPage.save();
		browser.app.waitForItemScreen();
		browser.itemPage.assertInputs({
			listName: 'TextArray',
			fields: {
				'name': {value: 'TextArray Field Test 1'},
			}
		})
	},
	'TextArray field should show correctly in the edit form': function(browser) {
		browser.itemPage.assertUI({
			listName: 'TextArray',
			fields: ['fieldA', 'fieldB']
		});
		browser.itemPage.section.form.section.textarrayList.section.fieldA.addText();
		browser.itemPage.assertUI({
			listName: 'TextArray',
			fields: ['fieldA'],
			args: {'textInputs': ['text1']}
		});
		browser.itemPage.section.form.section.textarrayList.section.fieldA.addText();
		browser.itemPage.assertUI({
			listName: 'TextArray',
			fields: ['fieldA'],
			args: {'textInputs': ['text1', 'text2']}
		});
		browser.itemPage.section.form.section.textarrayList.section.fieldB.addText();
		browser.itemPage.section.form.section.textarrayList.section.fieldB.addText();
		browser.itemPage.assertUI({
			listName: 'TextArray',
			fields: ['fieldB'],
			args: {'textInputs': ['text1', 'text2']}
		});
	},
	'TextArray field can be filled via the edit form': function(browser) {
		browser.itemPage.fillInputs({
			listName: 'TextArray',
			fields: {
				'fieldA': {text1: 'Test text 1', text2: 'Test text 2'}
			}
		});
		browser.itemPage.fillInputs({
			listName: 'TextArray',
			fields: {
				'fieldB': {text1: 'Test text 3', text2: 'Test text 4'}
			}
		});
		browser.itemPage.save();
		browser.app.waitForItemScreen();
		browser.itemPage.assertFlashMessage('Your changes have been saved successfully');
		browser.itemPage.assertInputs({
			listName: 'TextArray',
			fields: {
				'name': {value: 'TextArray Field Test 1'},
				'fieldA': {text1: 'Test text 1', text2: 'Test text 2'},
				'fieldB': {text1: 'Test text 3', text2: 'Test text 4'},
			}
		})
	},
};
