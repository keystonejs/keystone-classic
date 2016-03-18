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
			.pause(browser.globals.defaultPauseTimeout);
	},
	after: function (browser) {
		browser
			.click(adminUI.cssSelector.allView.logoutIconLink)
			.pause(browser.globals.defaultPauseTimeout)
			.end();
	},
	'Select field can be created via the initial modal': function (browser) {
		browser
			.click(adminUI.cssSelector.homeView.plusIconLinkForSelectsTabUnderDashboardFieldsSubheading)
			.waitForElementVisible(adminUI.cssSelector.initialModalView.id)
			.pause(browser.globals.defaultPauseTimeout)
			.click(adminUI.cssSelector.initialModalView.fieldType.select.select.name.inputField)
			.pause(browser.globals.defaultPauseTimeout)
			.keys(browser.globals.keyStrokes.enterKey)
			.pause(browser.globals.defaultPauseTimeout)
			.click(adminUI.cssSelector.initialModalView.buttonCreate)
			.waitForElementVisible(adminUI.cssSelector.itemView.id)
			.pause(browser.globals.defaultPauseTimeout);

		browser.expect.element(adminUI.cssSelector.itemView.flashMessage)
			.text.to.equal('New Select One created.');
		browser.expect.element(adminUI.cssSelector.itemView.itemHeader)
			.text.to.equal('One');
		browser.expect.element(adminUI.cssSelector.itemView.fieldType.select.select.name.inputValue)
			.text.to.equals('One');
	},
	'Select field can be created via the edit form': function (browser) {
		browser
			.click(adminUI.cssSelector.itemView.fieldType.select.select.testA.inputField)
			.pause(browser.globals.defaultPauseTimeout)
			.keys(browser.globals.keyStrokes.downArrowKey)
			.pause(browser.globals.defaultPauseTimeout)
			.keys(browser.globals.keyStrokes.enterKey)
			.pause(browser.globals.defaultPauseTimeout)
			.click(adminUI.cssSelector.itemView.itemSaveButton)
			.waitForElementVisible(adminUI.cssSelector.itemView.id)
			.pause(browser.globals.defaultPauseTimeout);

		browser.expect.element(adminUI.cssSelector.itemView.flashMessage)
			.text.to.equal('Your changes have been saved.');
		browser.expect.element(adminUI.cssSelector.itemView.itemHeader)
			.text.to.equal('One');
		browser.expect.element(adminUI.cssSelector.itemView.fieldType.select.select.testA.inputValue)
			.text.to.equals('Two');
	},
};
