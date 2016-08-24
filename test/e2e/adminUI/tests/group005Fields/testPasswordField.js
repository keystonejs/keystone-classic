var fieldTests = require('./commonFieldTestUtils.js');

module.exports = {
	before: fieldTests.before,
	after: fieldTests.after,
	'Password field should show correctly in the initial modal': function (browser) {
		browser.app.openFieldList('Password');
		browser.listScreen.createFirstItem();
		browser.app.waitForInitialFormScreen();

		browser.initialFormScreen.assertUI({
			listName: 'Password',
			fields: ['name', 'fieldA'],
			args: {'editForm': false}, // To check for @value instead of @button
		});
	},
	'restoring test state': function(browser) {
		browser.initialFormScreen.cancel();
		browser.app.waitForListScreen();
	},
	'Password field can be filled via the initial modal': function(browser) {
		browser.app.openFieldList('Password');
		browser.listScreen.createFirstItem();
		browser.app.waitForInitialFormScreen();
		browser.initialFormScreen.fillInputs({
			listName: 'Password',
			fields: {
				'name': {value: 'Password Field Test 1'},
				'fieldA': {value: 'password1', confirm: 'wrongPassword1'},
			}
		});
		browser.initialFormScreen.save();
		browser.initialFormScreen.assertFlashError("Passwords must match");
		browser.initialFormScreen.fillInputs({
			listName: 'Password',
			fields: {
				'fieldA': {value: 'password1', confirm: 'password1'},
			}
		});
		browser.initialFormScreen.assertInputs({
			listName: 'Password',
			fields: {
				'name': {value: 'Password Field Test 1'},
			}
		});
		browser.initialFormScreen.save();
		browser.app.waitForItemScreen();

		browser.itemScreen.assertInputs({
			listName: 'Password',
			fields: {
				'name': {value: 'Password Field Test 1'},
			}
		})
	},
	'Password field should show correctly in the edit form': function(browser) {
		browser.itemScreen.assertUI({
			listName: 'Password',
			fields: ['fieldA', 'fieldB'],
			args: {'editForm': true}, // To check for @button instead of @value
		});
	},
	'Password field can be filled via the edit form': function(browser) {
		browser.itemScreen.section.form.section.passwordList.section.fieldB.clickSetPassword();
		browser.itemScreen.fillInputs({
			listName: 'Password',
			fields: {
				'fieldB': {value: 'password2', confirm: 'wrongPassword2'}
			}
		});
		browser.itemScreen.save();
		browser.app.waitForItemScreen();
		browser.itemScreen.assertFlashError('Passwords must match');
		browser.itemScreen.fillInputs({
			listName: 'Password',
			fields: {
				'fieldB': {value: 'password2', confirm: 'password2'}
			}
		});
		browser.itemScreen.save();
		browser.app.waitForItemScreen();
		browser.itemScreen.assertFlashMessage('Your changes have been saved successfully');
		browser.itemScreen.assertInputs({
			listName: 'Password',
			fields: {
				'name': {value: 'Password Field Test 1'},
			}
		})
	},
};
