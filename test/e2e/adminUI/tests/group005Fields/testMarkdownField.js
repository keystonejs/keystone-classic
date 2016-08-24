var fieldTests = require('./commonFieldTestUtils.js');

module.exports = {
	before: fieldTests.before,
	after: fieldTests.after,
	'Markdown field should show correctly in the initial modal': function (browser) {
		browser.app.openFieldList('Markdown');
		browser.listScreen.createFirstItem();
		browser.app.waitForInitialFormScreen();

		browser.initialFormScreen.assertUI({
			listName: 'Markdown',
			fields: ['name', 'fieldA']
		});
	},
	'restoring test state': function(browser) {
		browser.initialFormScreen.cancel();
		browser.app.waitForListScreen();
	},
	'Markdown field can be filled via the initial modal': function(browser) {
		browser.app.openFieldList('Markdown');
		browser.listScreen.createFirstItem();
		browser.app.waitForInitialFormScreen();
		browser.initialFormScreen.fillInputs({
			listName: 'Markdown',
			fields: {
				'name': {value: 'Markdown Field Test 1'},
				'fieldA': {md: 'Some __test__ markdown for **field A**'},
			}
		});
		browser.initialFormScreen.assertInputs({
			listName: 'Markdown',
			fields: {
				'name': {value: 'Markdown Field Test 1'},
				'fieldA': {md: 'Some __test__ markdown for **field A**'},
			}
		});
		browser.initialFormScreen.section.form.section.markdownList.section.fieldA.togglePreview();
		browser.initialFormScreen.assertInputs({
			listName: 'Markdown',
			fields: {
				'name': {value: 'Markdown Field Test 1'},
				'fieldA': {html: '<p>Some <strong>test</strong> markdown for <strong>field A</strong></p>\n'},
			}
		});
		browser.initialFormScreen.save();
		browser.app.waitForItemScreen();

		browser.itemScreen.assertInputs({
			listName: 'Markdown',
			fields: {
				'name': {value: 'Markdown Field Test 1'},
				'fieldA': {md: 'Some __test__ markdown for **field A**'},
			}
		})
	},
	'Markdown field should show correctly in the edit form': function(browser) {
		browser.itemScreen.assertUI({
			listName: 'Markdown',
			fields: ['fieldA', 'fieldB']
		});
	},
	'Markdown field can be filled via the edit form': function(browser) {
		browser.itemScreen.fillInputs({
			listName: 'Markdown',
			fields: {
				'fieldB': {md: 'Some __test__ markdown for **field B**'}
			}
		});
		browser.itemScreen.save();
		browser.app.waitForItemScreen();
		browser.itemScreen.assertFlashMessage('Your changes have been saved successfully');
		browser.itemScreen.assertInputs({
			listName: 'Markdown',
			fields: {
				'name': {value: 'Markdown Field Test 1'},
				'fieldA': {md: 'Some __test__ markdown for **field A**'},
				'fieldB': {md: 'Some __test__ markdown for **field B**'}
			}
		});
		/* TODO Work out why this was breaking travis, and re-implement
		See https://travis-ci.org/keystonejs/keystone/builds/130040822#L2215
		browser.itemScreen.section.form.section.markdownList.section.fieldA.togglePreview();
		browser.itemScreen.section.form.section.markdownList.section.fieldB.togglePreview();
		browser.itemScreen.assertInputs({
			listName: 'Markdown',
			fields: {
				'name': {value: 'Markdown Field Test 1'},
				'fieldA': {html: '<p>Some <strong>test</strong> markdown for <strong>field A</strong></p>\n'},
				'fieldB': {html: '<p>Some <strong>test</strong> markdown for <strong>field A</strong></p>\n'}
			}
		});
		*/
	},
};
