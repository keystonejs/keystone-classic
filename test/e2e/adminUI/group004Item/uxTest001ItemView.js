var adminUI = require('../adminUI');

module.exports = {
	before: function (browser) {
		browser
			.url(adminUI.url)
			.waitForElementVisible(adminUI.cssSelector.signinView.id)
			.setValue(adminUI.cssSelector.signinView.emailInput, adminUI.login.email)
			.setValue(adminUI.cssSelector.signinView.passwordInput, adminUI.login.password)
			.pause(browser.globals.defaultPauseTimeout)
			.click(adminUI.cssSelector.signinView.submitButton)
			.pause(browser.globals.defaultPauseTimeout)
			.url(adminUI.url)
			.waitForElementVisible(adminUI.cssSelector.homeView.id)
			.pause(browser.globals.defaultPauseTimeout)
			.click(adminUI.cssSelector.allView.accessMenu)
			.waitForElementVisible(adminUI.cssSelector.listView.id)
			.pause(browser.globals.defaultPauseTimeout)
			.click(adminUI.cssSelector.listView.nameColumnValueForUserList)
			.waitForElementVisible(adminUI.cssSelector.itemView.id)
			.pause(browser.globals.defaultPauseTimeout);
	},
	after: function (browser) {
		browser
			.click(adminUI.cssSelector.allView.logoutIconLink)
			.pause(browser.globals.defaultPauseTimeout)
			.end();
	},
	'Item view should allow creating an item of the same type': function (browser) {
		browser
			.click(adminUI.cssSelector.itemView.newItemPlusButton)
			.pause(browser.globals.defaultPauseTimeout)
			.setValue(adminUI.cssSelector.initialModalView.field.name.first, 'First1')
			.setValue(adminUI.cssSelector.initialModalView.field.name.last, 'Last1')
			.setValue(adminUI.cssSelector.initialModalView.field.email.value, 'first1.last1@test.e2e')
			.setValue(adminUI.cssSelector.initialModalView.field.password.value, 'test')
			.setValue(adminUI.cssSelector.initialModalView.field.password.value_confirm, 'test')
			.pause(browser.globals.defaultPauseTimeout)
			.click(adminUI.cssSelector.initialModalView.buttonCreate)
			.waitForElementVisible(adminUI.cssSelector.itemView.id)
			.pause(browser.globals.defaultPauseTimeout);

		browser.expect.element(adminUI.cssSelector.itemView.flashMessage)
			.text.to.equal('New User First1 Last1 created.')
	},
	'Item view should allow saving an item without changes': function (browser) {
		browser
			.click(adminUI.cssSelector.itemView.itemSaveButton);

		browser.expect.element(adminUI.cssSelector.itemView.flashMessage)
			.text.to.equal('Your changes have been saved.')
	},
	'Item view should allow saving an item with changes': function (browser) {
		browser
			.clearValue(adminUI.cssSelector.itemView.field.name.first)
			.setValue(adminUI.cssSelector.itemView.field.name.first, 'First1X')
			.clearValue(adminUI.cssSelector.itemView.field.name.last)
			.setValue(adminUI.cssSelector.itemView.field.name.last, 'Last1X')
			.pause(browser.globals.defaultPauseTimeout)
			.click(adminUI.cssSelector.itemView.itemSaveButton);

		browser.expect.element(adminUI.cssSelector.itemView.flashMessage)
			.text.to.equal('Your changes have been saved.')
	},
	'Item view should allow resetting an item with changes': function (browser) {
		browser
			.clearValue(adminUI.cssSelector.itemView.field.name.first)
			.setValue(adminUI.cssSelector.itemView.field.name.first, 'First1XXXXXXXXXX')
			.clearValue(adminUI.cssSelector.itemView.field.name.last)
			.setValue(adminUI.cssSelector.itemView.field.name.last, 'Last1XXXXXXXXXXX')
			.pause(browser.globals.defaultPauseTimeout)
			.click(adminUI.cssSelector.itemView.itemResetButton)
			.waitForElementVisible(adminUI.cssSelector.resetConfirmationModalView.id)
			.click(adminUI.cssSelector.resetConfirmationModalView.buttonDelete)
			.waitForElementVisible(adminUI.cssSelector.itemView.id);

		browser.expect.element(adminUI.cssSelector.itemView.field.name.first)
			.to.have.value.that.equals('First1X');
		browser.expect.element(adminUI.cssSelector.itemView.field.name.last)
			.to.have.value.that.equals('Last1X');
	},
	'Item view should allow deleting an item': function (browser) {
		browser
			.click(adminUI.cssSelector.itemView.itemDeleteButton)
			.waitForElementVisible(adminUI.cssSelector.deleteConfirmationModalView.id)
			.click(adminUI.cssSelector.deleteConfirmationModalView.buttonDelete)
			.waitForElementVisible(adminUI.cssSelector.listView.id);
	},
};
